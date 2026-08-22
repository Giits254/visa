import { destinations } from "@/lib/data";

type Destination = (typeof destinations)[number];

export type PaymentState = "idle" | "initiating" | "awaiting_payment" | "paid" | "failed" | "cancelled";

type PaymentStepProps = {
  destination: Destination;
  usdToKesRate: number;
  phoneDisplay: string;
  paymentState: PaymentState;
  errorMessage: string | null;
  onMakePayment: () => void;
};

export default function PaymentStep({
  destination,
  usdToKesRate,
  phoneDisplay,
  paymentState,
  errorMessage,
  onMakePayment,
}: PaymentStepProps) {
  const kesAmount = Math.round(destination.feeUSD * usdToKesRate);
  const isBusy = paymentState === "initiating" || paymentState === "awaiting_payment";
  const canRetry = paymentState === "failed" || paymentState === "cancelled";

  return (
    <div>
      <div className="flex items-center justify-between rounded-xl bg-night px-5 py-4 text-sand">
        <div>
          <p className="text-xs uppercase tracking-wider text-sand/60">Amount due</p>
          <p className="font-mono text-xl font-semibold text-gold">
            ${destination.feeUSD}.00 USD
          </p>
          <p className="mt-0.5 font-mono text-sm text-sand/70">
            ≈ KES {kesAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-sand/60">M-Pesa number</p>
          <p className="font-mono text-lg font-semibold">{phoneDisplay || "—"}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-3 text-sm">
        {[
          "Tap Make Payment below.",
          "You'll get an M-Pesa STK push prompt on your phone within a few seconds.",
          "Enter your M-Pesa PIN to approve it.",
          "We'll confirm automatically as soon as Safaricom confirms — no need to refresh.",
        ].map((line, i) => (
          <li key={line} className="flex gap-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal/10 font-mono text-xs font-medium text-teal-dark">
              {i + 1}
            </span>
            <span className="text-ink/80">{line}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 border-t border-dashed border-night/15 pt-6">
        {paymentState === "paid" ? (
          <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-success text-xs text-white">
              ✓
            </span>
            <p className="text-sm font-medium text-success-dark">
              Payment confirmed — continue to review &amp; submit.
            </p>
          </div>
        ) : (
          <>
            {paymentState === "idle" && (
              <p className="text-xs text-ink/65">
                You must complete payment before you can submit your application.
              </p>
            )}
            {paymentState === "initiating" && (
              <p className="flex items-center gap-2 text-xs font-medium text-ink/70">
                <span className="h-3.5 w-3.5 flex-none animate-spin rounded-full border-2 border-night/15 border-t-teal" />
                Sending the payment request…
              </p>
            )}
            {paymentState === "awaiting_payment" && (
              <p className="flex items-center gap-2 text-xs font-medium text-teal-dark">
                <span className="h-3.5 w-3.5 flex-none animate-spin rounded-full border-2 border-teal/20 border-t-teal" />
                Check your phone — enter your M-Pesa PIN to confirm. This page updates automatically.
              </p>
            )}
            {paymentState === "failed" && (
              <p className="text-xs font-medium text-red-600">
                {errorMessage || "That payment attempt failed. You can try again."}
              </p>
            )}
            {paymentState === "cancelled" && (
              <p className="text-xs font-medium text-red-600">
                The payment request was cancelled. You can try again.
              </p>
            )}

            <button
              type="button"
              onClick={onMakePayment}
              disabled={isBusy}
              className="mt-4 w-full rounded-full bg-success px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-success-dark disabled:opacity-60"
            >
              {isBusy ? "Waiting for confirmation…" : canRetry ? "Try payment again" : "Make Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
