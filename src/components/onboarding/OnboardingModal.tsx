
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { useOnboardingSubmit } from "./hooks/useOnboardingSubmit";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { OnboardingData } from "./types";
import { useLocation } from "react-router-dom";

interface OnboardingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isIncompleteProfile?: boolean;
}

export function OnboardingModal({ open = false, onOpenChange, isIncompleteProfile = false }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const isInvitedUser = location.state?.isInvited;
  const showOnboarding = location.state?.showOnboarding ?? true;
  // Only show workspace creation step if user is not invited and not completing an incomplete profile
  const TOTAL_STEPS = isIncompleteProfile || isInvitedUser ? 3 : 4;

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    role: "",
    companySize: "",
    goals: [],
    referralSource: "",
    workspaceName: isIncompleteProfile ? undefined : (isInvitedUser ? undefined : ""),
    password: "",
  });

  const { handleSubmit, loading } = useOnboardingSubmit({ onOpenChange });

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
      isInvitedUser,
      isIncompleteProfile,
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      case 4:
        return !isInvitedUser && !isIncompleteProfile ? <Step4 {...commonProps} /> : null;
      default:
        return null;
    }
  };

  // Don't show modal if showOnboarding is false
  if (!showOnboarding) {
    return null;
  }

  // When modal attempts to close, only allow it if it's not mandatory
  const handleOpenChange = (value: boolean) => {
    // Prevent closing the modal if it's for an incomplete profile or during initial onboarding
    if (!value && (isIncompleteProfile || (open && currentStep < TOTAL_STEPS))) {
      return;
    }
    
    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[500px] p-0 [&>button]:hidden">
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
