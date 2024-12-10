import { OnboardingData } from "../../onboarding/types";
import { Button } from "@/components/ui/button";
import { RoleField } from "../../onboarding/components/fields/RoleField";
import { CompanySizeField } from "../../onboarding/components/fields/CompanySizeField";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface InviteStep3Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
}

export function InviteStep3({ onNext, onBack, data, loading }: InviteStep3Props) {
  const [role, setRole] = useState(data.role || "");
  const [companySize, setCompanySize] = useState(data.companySize || "");
  const [referralSource, setReferralSource] = useState(data.referralSource || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      role,
      companySize,
      referralSource,
    });
  };

  const isValid = role && companySize && referralSource;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <RoleField value={role} onChange={setRole} />
        <CompanySizeField value={companySize} onChange={setCompanySize} />
        
        <div className="space-y-2">
          <label htmlFor="referralSource" className="text-sm font-medium">
            How did you hear about us?
          </label>
          <Input
            id="referralSource"
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
            placeholder="e.g. Google, Friend, Social Media"
          />
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
        <Button type="submit" disabled={loading || !isValid}>
          {loading ? "Loading..." : "Complete"}
        </Button>
      </div>
    </form>
  );
}