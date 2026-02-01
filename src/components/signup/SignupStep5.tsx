import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SignupStepProps } from "./types";

interface SignupStep5Props extends SignupStepProps {
  onComplete: (workspaceName: string) => void;
  loading?: boolean;
}

export function SignupStep5({ data, onBack, onComplete, loading }: SignupStep5Props) {
  const defaultName = data.firstName ? `${data.firstName}'s Space` : "My Space";
  const [workspaceName, setWorkspaceName] = useState<string>(data.workspaceName || defaultName);

  useEffect(() => {
    if (!data.workspaceName && data.firstName) {
      setWorkspaceName(`${data.firstName}'s Space`);
    }
  }, [data.firstName, data.workspaceName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(workspaceName.trim());
  };

  const isValid = workspaceName.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create Your Workspace
        </h2>
        <p className="text-muted-foreground">
          This will be your team's home for innovation
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workspaceName">Workspace Name</Label>
        <Input
          id="workspaceName"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder={defaultName}
          className="text-base"
        />
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
              Creating workspace...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </form>
  );
}
