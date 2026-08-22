import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { normalizePaywaveResult } from "@/lib/paywave";
import { recordPaymentResult } from "@/lib/db";

// Register this URL with Paywave as your STK push callback, with the
// shared token appended, e.g.:
//   https://your-domain.example/api/payment/callback?token=YOUR_PAYWAVE_CALLBACK_TOKEN
//
// We always return 200 (even on a token mismatch or an application we can't
// find) so Paywave doesn't retry forever on something we already understand
// and have decided to drop.
export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!env.PAYWAVE_CALLBACK_TOKEN || token !== env.PAYWAVE_CALLBACK_TOKEN) {
    return NextResponse.json({ ok: false, reason: "invalid_token" }, { status: 200 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_body" }, { status: 200 });
  }

  const result = normalizePaywaveResult(payload);
  if (result.outcome === "pending") {
    // Nothing settled yet — ignore, we'll hear again or the status poll will pick it up.
    return NextResponse.json({ ok: true, applied: false });
  }

  const status = result.outcome === "paid" ? "paid" : result.outcome === "cancelled" ? "payment_cancelled" : "payment_failed";

  const application = await recordPaymentResult(
    {
      referenceCode: result.transactionReference,
      checkoutRequestId: result.checkoutRequestId,
    },
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

  return NextResponse.json({ ok: true, applied: application !== null });
}
