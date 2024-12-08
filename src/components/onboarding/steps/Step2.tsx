import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    const selectedGoals = [formData.get('goals')] as string[];
    onNext({ goals: selectedGoals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">What do you want to accomplish?</h2>
        <p className="text-muted-foreground">Select your primary goal</p>
      </div>

      <RadioGroup 
        name="goals" 
        defaultValue={data.goals[0]}
        className="space-y-2"
        required
      >
        {GOALS.map((goal) => (
          <div key={goal} className="rounded-[5px] border border-muted p-3 hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary-50">
            <RadioGroupItem 
              value={goal} 
              id={goal}
              className="hidden"
            />
            <Label 
              htmlFor={goal} 
              className="leading-tight cursor-pointer text-base font-normal w-full block"
            >
              {goal}
            </Label>
          </div>
        ))}
      </RadioGroup>

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