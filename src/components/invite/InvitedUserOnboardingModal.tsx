import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Step1 } from "../onboarding/steps/Step1";
import { Step2 } from "../onboarding/steps/Step2";
import { Step3 } from "../onboarding/steps/Step3";
import { OnboardingProgress } from "../onboarding/components/OnboardingProgress";
import { OnboardingData } from "../onboarding/types";
import { useOnboardingSubmit } from "../onboarding/hooks/useOnboardingSubmit";
import { useNavigate } from "react-router-dom";

interface InvitedUserOnboardingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  workspaceId?: string;
}

export function InvitedUserOnboardingModal({ 
  open = false, 
  onOpenChange,
  workspaceId 
}: InvitedUserOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 3;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    role: "",
    companySize: "",
    goals: [],
    referralSource: "",
    workspaceName: undefined,
  });

  const { handleSubmit, loading } = useOnboardingSubmit({ 
    onOpenChange,
    onSuccess: () => {
      if (workspaceId) {
        navigate(`/dashboard?workspace=${workspaceId}`);
      } else {
        navigate('/dashboard');
      }
    }
  });

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === TOTAL_STEPS) {
      await handleSubmit(updatedData);
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
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) return;
      if (onOpenChange) onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[600px] h-[600px] p-0 [&>button]:hidden">
        <div className="p-6 h-full flex flex-col">
          <DialogHeader>
            <div className="space-y-4">
              <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
              {renderStep()}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}