import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupStepProps } from "./types";
import { RoleField } from "@/components/onboarding/components/fields/RoleField";

interface SignupStep3Props extends SignupStepProps {
  onCompanyInfoSet: (companyName: string, role: string) => void;
}

export function SignupStep3({ data, onBack, onCompanyInfoSet }: SignupStep3Props) {
  const [companyName, setCompanyName] = useState(data.companyName);
  const [role, setRole] = useState(data.role);

  const isFormValid = companyName.trim() !== "" && role !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onCompanyInfoSet(companyName.trim(), role);
  };

  const handleSelectChange = (_name: string, value: string) => {
    setRole(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          About your work
        </h2>
        <p className="text-muted-foreground">
          Help us understand your context
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corporation"
            className="mt-1"
          />
        </div>

        <RoleField
          role={role}
          handleSelectChange={handleSelectChange}
        />

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
            disabled={!isFormValid}
            variant={isFormValid ? "default" : "secondary"}
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
