import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OnboardingData } from "../OnboardingModal";
import { Checkbox } from "@/components/ui/checkbox";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedGoals = GOALS.filter(goal => formData.get(goal) === "on");
    onNext({ goals: selectedGoals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">What do you want to accomplish?</h2>
        <p className="text-muted-foreground">Select all that apply</p>
      </div>

      <div className="space-y-4">
        {GOALS.map((goal) => (
          <div key={goal} className="flex items-center space-x-2">
            <Checkbox
              id={goal}
              name={goal}
              defaultChecked={data.goals.includes(goal)}
            />
            <Label htmlFor={goal} className="leading-tight">{goal}</Label>
          </div>
        ))}
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