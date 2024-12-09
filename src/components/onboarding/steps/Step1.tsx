import { Button } from "@/components/ui/button";
import { OnboardingData } from "../types";
import { useState, useEffect } from "react";
import { PersonalInfoFields } from "../components/PersonalInfoFields";
import { validateFormData } from "../utils/validation";

interface Step1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  loading?: boolean;
  isInvitedUser?: boolean;
}

export function Step1({ onNext, data, loading, isInvitedUser }: Step1Props) {
  const [formData, setFormData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    password: data.password || "",
  });
  
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(validateFormData(
      formData.firstName,
      formData.lastName,
      undefined,
      undefined,
      isInvitedUser ? formData.password : undefined
    ));
  }, [formData, isInvitedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col items-center mb-8">
        <img 
          src="/lovable-uploads/c3f37922-28e6-4abc-9884-28e703e28a9d.png" 
          alt="Limitless Lab Logo" 
          className="h-12 mb-8"
        />
        <div className="text-center space-y-2">
          <h2 className="text-[32px] font-semibold tracking-tight">Welcome to Limitless Lab!</h2>
          <p className="text-[#667085] text-lg">
            Let's finish setting up your account
          </p>
        </div>
      </div>

      <PersonalInfoFields
        formData={formData}
        handleInputChange={handleInputChange}
        isInvitedUser={isInvitedUser}
      />

      <Button 
        type="submit" 
        className="w-full h-11 text-base font-medium" 
        disabled={loading || !isValid}
      >
        Continue
      </Button>
    </form>
  );
}