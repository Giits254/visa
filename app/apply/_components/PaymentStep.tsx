import { destinations } from "@/lib/data";

type Destination = (typeof destinations)[number];

type PaymentStepProps = {
  destination: Destination;
  mpesaTillNumber: string | number;
  paymentConfirmed: boolean;
  confirmingPayment: boolean;
  onConfirmPayment: () => void;
  nationality: string;
  usdToKesRate: number;
};

export default function PaymentStep({
  destination,
  mpesaTillNumber,
  paymentConfirmed,
  confirmingPayment,
  onConfirmPayment,
  nationality,
  usdToKesRate,
}: PaymentStepProps) {
  const isKenya = nationality === "Kenya";
  const kesAmount = Math.round(destination.feeUSD * usdToKesRate);
  return (
    <div>
      <div className="flex items-center justify-between rounded-xl bg-night px-5 py-4 text-sand">
        <div>
          <p className="text-xs uppercase tracking-wider text-sand/60">Amount due</p>
          <p className="font-mono text-xl font-semibold text-gold">
            ${destination.feeUSD}.00 USD
          </p>
          {isKenya && (
            <p className="mt-0.5 font-mono text-sm text-sand/70">
              ≈ KES {kesAmount.toLocaleString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-sand/60">M-Pesa Till</p>
          <p className="font-mono text-xl font-semibold">{mpesaTillNumber}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-3 text-sm">
        {[
          "Open the M-Pesa menu on your phone.",
          "Select Lipa na M-Pesa, then Buy Goods and Services.",
          `Enter Till Number ${mpesaTillNumber}.`,
          `Enter the amount — $${destination.feeUSD} USD${
            isKenya ? ` (≈ KES ${kesAmount.toLocaleString()})` : ", or its KES equivalent at checkout"
          }.`,
          "Enter your M-Pesa PIN and confirm.",
          "You'll get an M-Pesa confirmation message immediately — keep it for your records.",
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
        {paymentConfirmed ? (
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
            <p className="text-xs font-medium uppercase tracking-wider text-ink/55">
              Draft preview
            </p>
            <p className="mt-1 text-xs text-ink/65">
              Payment isn&apos;t connected yet — use this button to
              preview what happens once M-Pesa confirms payment.
              You must confirm payment before you can submit.
            </p>
            <button
              type="button"
              onClick={onConfirmPayment}
              disabled={confirmingPayment}
              className="mt-4 w-full rounded-full bg-success px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-success-dark disabled:opacity-60"
            >
              {confirmingPayment ? "Confirming payment…" : "Simulate payment confirmation"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}