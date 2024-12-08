import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingData } from "../OnboardingModal";

interface Step3Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
}

const REFERRAL_SOURCES = [
  "Google Search",
  "Social Media",
  "Friend or Colleague",
  "Professional Network",
  "Online Advertisement",
  "Blog or Article",
  "Conference or Event",
  "Other"
];

export function Step3({ onNext, onBack, data, loading }: Step3Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onNext({
      referralSource: formData.get("referralSource") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">How did you hear about us?</h2>
        <p className="text-muted-foreground">Help us understand how you found Limitless Lab</p>
      </div>

      <RadioGroup 
        name="referralSource" 
        defaultValue={data.referralSource}
        className="space-y-4"
        required
      >
        {REFERRAL_SOURCES.map((source) => (
          <div key={source} className="flex items-start space-x-3">
            <RadioGroupItem 
              value={source} 
              id={source}
              className="h-5 w-5 mt-0.5"
            />
            <Label 
              htmlFor={source} 
              className="leading-tight cursor-pointer text-base font-normal"
            >
              {source}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="px-8"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={loading}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}