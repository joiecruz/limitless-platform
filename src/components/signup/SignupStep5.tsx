import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SignupStepProps } from "./types";
import { cn } from "@/lib/utils";

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

interface SignupStep5Props extends SignupStepProps {
  onReferralSet: (referralSource: string) => void;
}

export function SignupStep5({ data, onBack, onReferralSet }: SignupStep5Props) {
  const [selectedSource, setSelectedSource] = useState<string>(data.referralSource || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReferralSet(selectedSource);
  };

  const isValid = selectedSource !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          How did you hear about Limitless Lab?
        </h2>
        <p className="text-muted-foreground">
          Help us understand how you found us
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {REFERRAL_SOURCES.map((source) => {
          const isSelected = selectedSource === source;
          return (
            <button
              key={source}
              type="button"
              onClick={() => setSelectedSource(source)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors",
                isSelected 
                  ? "border-primary bg-primary/5 text-foreground" 
                  : "border-border hover:bg-muted/50 text-foreground"
              )}
            >
              {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
              <span className="text-sm font-normal">{source}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1"
          disabled={!isValid}
          variant={isValid ? "default" : "secondary"}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
