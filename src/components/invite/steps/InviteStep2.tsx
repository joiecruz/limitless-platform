import { OnboardingData } from "../../onboarding/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface InviteStep2Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
}

const GOALS = [
  "Collaborate with teams and stakeholders on innovation projects",
  "Streamline project management of innovation projects",
  "Learn and apply innovation methodologies",
  "Access innovation resources and templates",
  "Network with like-minded innovators",
];

export function InviteStep2({ onNext, onBack, data, loading }: InviteStep2Props) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ goals: selectedGoals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">What are your goals?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select all that apply
        </p>
        <div className="space-y-4">
          {GOALS.map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={goal}
                checked={selectedGoals.includes(goal)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedGoals([...selectedGoals, goal]);
                  } else {
                    setSelectedGoals(selectedGoals.filter((g) => g !== goal));
                  }
                }}
              />
              <label
                htmlFor={goal}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {goal}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button type="submit" disabled={loading || selectedGoals.length === 0}>
          {loading ? "Loading..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}