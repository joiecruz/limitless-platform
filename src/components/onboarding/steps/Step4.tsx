import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingData } from "../types";

interface Step4Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
}

export function Step4({ onNext, onBack, data, loading }: Step4Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onNext({
      workspaceName: formData.get("workspaceName") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">Name your workspace</h2>
        <p className="text-muted-foreground">This will be your team's home for innovation</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workspaceName">Workspace Name</Label>
        <Input
          id="workspaceName"
          name="workspaceName"
          placeholder="e.g. Acme Innovation Hub"
          defaultValue={data.workspaceName}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          Complete Setup
        </Button>
      </div>
    </form>
  );
}
