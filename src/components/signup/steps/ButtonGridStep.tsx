import { Button } from "@/components/ui/button";

interface Option {
  value: string;
  label: string;
}

interface ButtonGridStepProps {
  title: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ButtonGridStep({ 
  title, 
  options, 
  value, 
  onChange, 
  onNext, 
  onPrev 
}: ButtonGridStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 text-left rounded-lg border transition-all ${
              value === option.value
                ? "border-primary-600 bg-primary-50 text-primary-600"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={onPrev} variant="outline">
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNext} 
          className="flex-1"
          disabled={!value}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}