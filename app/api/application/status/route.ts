import { NextResponse } from "next/server";
import { findApplicationByAnyCode } from "@/lib/db";

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "Payment pending",
  paid: "Payment confirmed — finishing submission",
  submitted: "Submitted — in review",
  payment_failed: "Payment failed",
  payment_cancelled: "Payment cancelled",
};

// Public lookup used by the "Already applied?" dialog. Deliberately returns
// a minimal, non-identifying payload (no email/phone/ID/address) since
// anyone with a code — not just the applicant — can query this.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim();
  if (!code) {
    return NextResponse.json({ error: "Missing ?code=" }, { status: 400 });
  }

  const application = await findApplicationByAnyCode(code);
  if (!application) {
    return NextResponse.json({ found: false });
  }

  const [firstName, ...rest] = application.full_name.split(" ");
  const lastInitial = rest.length ? ` ${rest[rest.length - 1][0]}.` : "";

  return NextResponse.json({
    found: true,
    referenceCode: application.reference_code,
    applicantName: `${firstName}${lastInitial}`,
    destinationName: application.destination_name,
    status: application.status,
    statusLabel: STATUS_LABELS[application.status] ?? application.status,
    submittedAt: application.submitted_at,
    paidAt: application.paid_at,
  });
}
