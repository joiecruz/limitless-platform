import { OnboardingData } from "../../onboarding/types";
import { Button } from "@/components/ui/button";
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
        <h2 className="text-2xl font-semibold mb-2">What do you want to accomplish?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select your goals (at least one)
        </p>
        <div className="space-y-2">
          {GOALS.map((goal) => (
            <div
              key={goal}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedGoals.includes(goal)
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => {
                if (selectedGoals.includes(goal)) {
                  setSelectedGoals(selectedGoals.filter((g) => g !== goal));
                } else {
                  setSelectedGoals([...selectedGoals, goal]);
                }
              }}
            >
              <span className="text-sm font-medium">{goal}</span>
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