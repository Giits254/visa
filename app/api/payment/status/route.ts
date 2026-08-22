import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { normalizePaywaveResult, verifyPaywaveTransaction } from "@/lib/paywave";
import { getApplicationByReference, recordPaymentResult } from "@/lib/db";

// Polled by the Apply page while waiting for the M-Pesa prompt to be
// answered. Doubles as our fallback for local dev / any environment where
// Paywave's webhook callback can't reach us: if the callback hasn't landed
// yet, we ask Paywave directly via verifyPayment.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const referenceCode = url.searchParams.get("ref")?.trim();
  if (!referenceCode) {
    return NextResponse.json({ error: "Missing ?ref=" }, { status: 400 });
  }

  let application = await getApplicationByReference(referenceCode);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  if (application.status === "awaiting_payment" && application.transaction_request_id) {
    const { env } = await getCloudflareContext({ async: true });
    try {
      const raw = await verifyPaywaveTransaction({
        baseUrl: env.PAYWAVE_BASE_URL,
        apiKey: env.PAYWAVE_API_KEY,
        email: env.PAYWAVE_EMAIL,
        transactionRequestId: application.transaction_request_id,
      });
      const result = normalizePaywaveResult(raw);
      if (result.outcome !== "pending") {
        const status = result.outcome === "paid" ? "paid" : result.outcome === "cancelled" ? "payment_cancelled" : "payment_failed";
        const updated = await recordPaymentResult(
          { referenceCode: application.reference_code },
          {
            status,
            transactionId: result.transactionId,
            transactionReceipt: result.transactionReceipt,
            transactionDate: result.transactionDate,
            msisdn: result.msisdn,
            responseCode: result.responseCode,
            responseDescription: result.responseDescription,
          }
        );
        if (updated) application = updated;
      }
    } catch {
      // Verification hiccup — just report current (pending) status and let
      // the frontend try again on the next poll.
    }
  }

  return NextResponse.json({
    status: application.status,
    transactionReceipt: application.transaction_receipt,
    responseDescription: application.payment_response_description,
  });
}
