import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SignupStepProps } from "./types";
import { cn } from "@/lib/utils";

const GOALS = [
  "Collaborate with teams and stakeholders on innovation projects",
  "Streamline project management of innovation projects",
  "Learn and apply innovation methodologies",
  "Access innovation resources and templates",
  "Network with like-minded innovators"
];

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

interface SignupStep4Props extends SignupStepProps {
  onGoalsSet: (goals: string[], referralSource: string) => void;
}

export function SignupStep4({ data, onBack, onGoalsSet }: SignupStep4Props) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || []);
  const [selectedSource, setSelectedSource] = useState<string>(data.referralSource || "");

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGoalsSet(selectedGoals, selectedSource);
  };

  const isValid = selectedGoals.length > 0 && selectedSource !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          How do you want to use Limitless Lab?
        </h2>
        <p className="text-muted-foreground">
          Select your goals (at least one)
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GOALS.map((goal) => {
          const isSelected = selectedGoals.includes(goal);
          return (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border p-3 transition-colors text-left",
                isSelected 
                  ? "border-primary bg-primary/5 text-foreground" 
                  : "border-border hover:bg-muted/50 text-foreground"
              )}
            >
              {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
              <span className="text-sm font-normal">{goal}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium text-foreground">
          How did you hear about Limitless Lab?
        </p>
        <div className="flex flex-wrap gap-2">
          {REFERRAL_SOURCES.map((source) => {
            const isSelected = selectedSource === source;
            return (
              <button
                key={source}
                type="button"
                onClick={() => setSelectedSource(source)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
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
      </div>

      <div className="flex gap-3 pt-2">
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
