import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingData } from "../types";
import { useState } from "react";
import { RoleField } from "../components/fields/RoleField";
import { CompanySizeField } from "../components/fields/CompanySizeField";

interface Step3Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
}

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

export function Step3({ onNext, onBack, data, loading }: Step3Props) {
  const [formData, setFormData] = useState({
    referralSource: data.referralSource || "",
    role: data.role || "",
    companySize: data.companySize || ""
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValid = formData.referralSource !== "" && 
                 formData.role !== "" && 
                 formData.companySize !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <RoleField 
          role={formData.role} 
          handleSelectChange={handleSelectChange}
        />

        <CompanySizeField 
          companySize={formData.companySize}
          handleSelectChange={handleSelectChange}
        />

        <div className="space-y-4">
          <Label>How did you hear about us?</Label>
          <RadioGroup 
            value={formData.referralSource}
            onValueChange={(value) => handleSelectChange("referralSource", value)}
            className="flex flex-wrap gap-2"
          >
            {REFERRAL_SOURCES.map((source) => (
              <div key={source} className="inline-flex rounded-[5px] border border-muted p-3 hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary-50">
                <RadioGroupItem 
                  value={source} 
                  id={source}
                  className="hidden"
                />
                <Label 
                  htmlFor={source} 
                  className="leading-tight cursor-pointer text-base font-normal"
                >
                  {source}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
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
          disabled={loading || !isValid}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}