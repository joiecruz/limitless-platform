import { OnboardingData } from "../../onboarding/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteStep3Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
}

const ROLES = [
  "Founder/CEO",
  "C-Level Executive",
  "Innovation Lead",
  "Manager",
  "Team Lead",
  "Employee",
  "Contributor",
  "Developer",
  "Analyst",
  "Consultant",
  "Project Manager",
  "Marketing Manager",
  "Sales Representative",
  "Customer Support",
  "Finance/Accountant",
  "IT Specialist",
  "Product Owner",
  "Designer",
  "Editor",
  "Reviewer",
  "Viewer",
  "Student",
  "Others"
];

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

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
        <div className="space-y-2">
          <Label htmlFor="role">What best describes you?</Label>
          <Select 
            value={role}
            onValueChange={setRole}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  {roleOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">How many employees does your company have?</Label>
          <Select
            value={companySize}
            onValueChange={setCompanySize}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="referralSource">How did you hear about us?</Label>
          <Input
            id="referralSource"
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
            placeholder="e.g. Google, Friend, Social Media"
            required
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