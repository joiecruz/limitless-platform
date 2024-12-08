import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

      <div className="space-y-2">
        <Label htmlFor="referralSource">Select an option</Label>
        <Select name="referralSource" defaultValue={data.referralSource} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose how you found us" />
          </SelectTrigger>
          <SelectContent>
            {REFERRAL_SOURCES.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          Continue
        </Button>
      </div>
    </form>
  );
}