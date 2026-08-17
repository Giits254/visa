type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="mb-10 flex items-center justify-between">
      {steps.map((label, i) => (
        <li key={label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-medium ${
                i <= currentStep
                  ? "bg-teal text-white"
                  : "border border-night/20 text-ink/50"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden text-xs sm:block ${
                i <= currentStep ? "text-night" : "text-ink/50"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span
              className={`mx-2 h-px flex-1 ${
                i < currentStep ? "bg-teal" : "bg-night/15"
              }`}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
