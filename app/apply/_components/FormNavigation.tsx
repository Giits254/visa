type FormNavigationProps = {
  step: number;
  totalSteps: number;
  paymentConfirmed: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function FormNavigation({
  step,
  totalSteps,
  paymentConfirmed,
  onBack,
  onNext,
}: FormNavigationProps) {
  const isPaymentStep = step === 2;
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="mt-8 flex gap-3">
      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-night/20 px-6 py-3 text-sm font-medium text-night transition hover:border-teal hover:text-teal"
        >
          Back
        </button>
      )}
      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          disabled={isPaymentStep && !paymentConfirmed}
          className="flex-1 rounded-full bg-night px-6 py-3 text-sm font-semibold text-sand transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPaymentStep && !paymentConfirmed
            ? "Confirm payment to continue"
            : isPaymentStep && paymentConfirmed
              ? "Review & submit"
              : "Continue"}
        </button>
      ) : (
        <button
          type="submit"
          className="flex-1 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night transition hover:bg-gold-light"
        >
          Submit application
        </button>
      )}
    </div>
  );
}
