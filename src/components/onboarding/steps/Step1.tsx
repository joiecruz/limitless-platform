import { Button } from "@/components/ui/button";
import { OnboardingData } from "../types";
import { useState, useEffect } from "react";
import { PersonalInfoFields } from "../components/PersonalInfoFields";
import { validateFormData } from "../utils/validation";

interface Step1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  loading?: boolean;
}

export function Step1({ onNext, data, loading }: Step1Props) {
  const [formData, setFormData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    companySize: data.companySize,
  });
  
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(validateFormData(
      formData.firstName,
      formData.lastName,
      formData.role,
      formData.companySize
    ));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">Tell us about yourself</h2>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
      </div>

      <PersonalInfoFields
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />

      <Button 
        type="submit" 
        className="w-full rounded-[5px]" 
        disabled={loading || !isValid}
        variant={isValid ? "default" : "secondary"}
      >
        Continue
      </Button>
    </form>
  );
}