import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { useOnboardingSubmit } from "./hooks/useOnboardingSubmit";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { OnboardingData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OnboardingModalProps {
  isInvitedUser?: boolean;
}

export function OnboardingModal({ isInvitedUser = false }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = isInvitedUser ? 3 : 4;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    role: "",
    companySize: "",
    goals: [],
    referralSource: "",
    workspaceName: "",
    password: "",
  });

  const { handleSubmit, loading } = useOnboardingSubmit({});

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === TOTAL_STEPS) {
      if (isInvitedUser) {
        try {
          // Sign up the user with the provided email and password
          const email = new URLSearchParams(window.location.search).get("email");
          const { error: signUpError } = await supabase.auth.signUp({
            email: email!,
            password: updatedData.password!,
            options: {
              data: {
                first_name: updatedData.firstName,
                last_name: updatedData.lastName,
              },
            },
          });

          if (signUpError) throw signUpError;

          // After successful signup, submit the rest of the onboarding data
          await handleSubmit(updatedData);
          
          navigate("/dashboard");
        } catch (error: any) {
          console.error("Error in signup process:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to complete setup",
            variant: "destructive",
          });
        }
      } else {
        await handleSubmit(updatedData);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    const commonProps = {
      onNext: handleNext,
      onBack: handleBack,
      loading,
      data: formData,
      isInvitedUser,
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      case 4:
        return !isInvitedUser ? <Step4 {...commonProps} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex flex-col items-center justify-center p-4">
      <img 
        src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
        alt="Limitless Lab Logo"
        className="h-12 mb-8"
      />
      <div className="w-full max-w-[800px] bg-white rounded-lg border border-gray-100 shadow-sm p-8">
        <div className="space-y-4">
          <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          {renderStep()}
        </div>
      </div>
    </div>
  );
}