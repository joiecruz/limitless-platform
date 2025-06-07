import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "../types";
import { useState } from "react";

interface Step2Props {
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
  "Network with like-minded innovators"
];

export function Step2({ onNext, onBack, data, loading }: Step2Props) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || []);

  const handleGoalChange = (goal: string, checked: boolean) => {
    setSelectedGoals(prev => 
      checked ? [...prev, goal] : prev.filter(g => g !== goal)
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext({ goals: selectedGoals });
  };

  const isValid = selectedGoals.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">What do you want to accomplish?</h2>
        <p className="text-muted-foreground">Select your goals (at least one)</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GOALS.map((goal) => (
          <div 
            key={goal} 
            className="inline-flex rounded-[5px] border border-muted p-3 hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary-50"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={goal}
                name={goal}
                checked={selectedGoals.includes(goal)}
                onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                className="hidden"
              />
              <Label 
                htmlFor={goal} 
                className="leading-tight cursor-pointer text-base font-normal"
              >
                {goal}
              </Label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="px-8 rounded-[5px]"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 rounded-[5px]" 
          disabled={loading || !isValid}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}