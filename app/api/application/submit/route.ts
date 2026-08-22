import { NextResponse } from "next/server";
import { destinations } from "@/lib/data";
import { getApplicationByReference, markSubmitted } from "@/lib/db";
import { sendApplicantConfirmationEmail, sendPlatformApplicationNotification } from "@/lib/resend";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const referenceCode = String(body.referenceCode ?? "").trim();
  if (!referenceCode) {
    return NextResponse.json({ error: "Missing referenceCode." }, { status: 400 });
  }

  const passportPhoto = body.passportPhoto as { filename?: string; contentBase64?: string } | undefined;

  let application = await getApplicationByReference(referenceCode);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  if (application.status !== "submitted") {
    if (application.status !== "paid") {
      return NextResponse.json({ error: "Payment isn't confirmed yet for this application." }, { status: 409 });
    }

    const updated = await markSubmitted(referenceCode);
    if (updated) application = updated;

    const destination = destinations.find((d) => d.code === application!.destination_code);

    try {
      await Promise.all([
        sendApplicantConfirmationEmail({
          to: application.email,
          fullName: application.full_name,
          referenceCode: application.reference_code,
          destinationName: application.destination_name,
          feeUsd: application.fee_usd,
          avgProcessing: destination?.avgProcessing ?? "a few business days",
        }),
        sendPlatformApplicationNotification({
          referenceCode: application.reference_code,
          fullName: application.full_name,
          email: application.email,
          phone: `${application.phone_country} ${application.phone}`,
          idNumber: application.id_number,
          nationality: application.nationality,
          destinationName: application.destination_name,
          street: application.street ?? "",
          city: application.city ?? "",
          zip: application.zip ?? "",
          state: application.state ?? undefined,
          travelDate: application.travel_date ?? "",
          purpose: application.purpose ?? "",
          feeUsd: application.fee_usd,
          amountKes: application.amount_kes,
          transactionReceipt: application.transaction_receipt,
          msisdn: application.msisdn,
          attachment:
            passportPhoto?.filename && passportPhoto?.contentBase64
              ? { filename: passportPhoto.filename, contentBase64: passportPhoto.contentBase64 }
              : null,
        }),
      ]);
    } catch (err) {
      // Don't fail the submission over an email hiccup — the application is
      // already saved and paid. Log so it's visible in `wrangler tail`.
      console.error("Failed to send confirmation emails:", err);
    }
  }

  return NextResponse.json({
    referenceCode: application.reference_code,
    status: application.status,
    transactionReceipt: application.transaction_receipt,
  });
}
