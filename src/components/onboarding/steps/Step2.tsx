import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "../OnboardingModal";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">What do you want to accomplish?</h2>
        <p className="text-muted-foreground">Select your goals</p>
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
                defaultChecked={data.goals.includes(goal)}
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
          disabled={loading}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}