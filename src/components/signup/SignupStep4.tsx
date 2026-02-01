import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { SignupStepProps } from "./types";

const GOALS = [
  "Collaborate with teams and stakeholders on innovation projects",
  "Streamline project management of innovation projects",
  "Learn and apply innovation methodologies",
  "Access innovation resources and templates",
  "Network with like-minded innovators"
];

interface SignupStep4Props extends SignupStepProps {
  onComplete: (goals: string[]) => void;
  loading?: boolean;
}

export function SignupStep4({ data, onBack, onComplete, loading }: SignupStep4Props) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || []);

  const handleGoalChange = (goal: string, checked: boolean) => {
    setSelectedGoals(prev => 
      checked ? [...prev, goal] : prev.filter(g => g !== goal)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(selectedGoals);
  };

  const isValid = selectedGoals.length > 0;

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
        {GOALS.map((goal) => (
          <div 
            key={goal} 
            className="inline-flex rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            onClick={() => handleGoalChange(goal, !selectedGoals.includes(goal))}
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
                className="leading-tight cursor-pointer text-sm font-normal text-foreground"
              >
                {goal}
              </Label>
            </div>
          </div>
        ))}
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
          disabled={loading || !isValid}
          variant={isValid ? "default" : "secondary"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing setup...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </form>
  );
}
