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
          const email = new URLSearchParams(window.location.search).get("email");
          const workspaceId = new URLSearchParams(window.location.search).get("workspace");
          const role = new URLSearchParams(window.location.search).get("role");

          if (!email || !workspaceId || !role) {
            throw new Error("Invalid invitation link");
          }

          // Sign up the user with the provided email and password
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: updatedData.password!,
            options: {
              data: {
                first_name: updatedData.firstName,
                last_name: updatedData.lastName,
              },
            },
          });

          if (signUpError) throw signUpError;

          // Sign in the user immediately after signup
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: updatedData.password!,
          });

          if (signInError) throw signInError;

          // After successful signup and signin, submit the rest of the onboarding data
          await handleSubmit(updatedData);
          
          // Redirect to dashboard
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
      <div className="w-full max-w-[800px] bg-white rounded-lg border border-gray-100 shadow-sm p-8">
        <div className="space-y-4">
          <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          {renderStep()}
        </div>
      </div>
    </div>
  );
}