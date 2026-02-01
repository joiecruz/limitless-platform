interface SignupProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function SignupProgress({ currentStep, totalSteps }: SignupProgressProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            step <= currentStep
              ? "bg-primary"
              : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}
