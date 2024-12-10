import { OnboardingData } from "../../onboarding/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

const REFERRAL_SOURCES = [
  "Google Search",
  "Social Media",
  "Friend or Colleague",
  "Professional Network",
  "Online Advertisement",
  "Blog or Article",
  "Conference or Event",
  "Other"
];

export function InviteStep3({ onNext, onBack, data, loading }: InviteStep3Props) {
  const [role, setRole] = useState(data.role || "");
  const [referralSource, setReferralSource] = useState(data.referralSource || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      role,
      referralSource,
    });
  };

  const isValid = role && referralSource;

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

        <div>
          <h2 className="text-lg font-semibold mb-4">How did you hear about us?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Help us understand how you found Limitless Lab
          </p>
          <div className="grid grid-cols-2 gap-3">
            {REFERRAL_SOURCES.map((source) => (
              <div
                key={source}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  referralSource === source
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setReferralSource(source)}
              >
                <span className="text-sm font-medium">{source}</span>
              </div>
            ))}
          </div>
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