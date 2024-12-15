import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { InviteStep1 } from "./steps/InviteStep1";
import { InviteStep2 } from "./steps/InviteStep2";
import { InviteStep3 } from "./steps/InviteStep3";
import { useInviteSubmit } from "./hooks/useInviteSubmit";
import { OnboardingProgress } from "../onboarding/components/OnboardingProgress";
import { OnboardingData } from "../onboarding/types";

interface InviteModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteModal({ open = false, onOpenChange }: InviteModalProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workspaceId = searchParams.get("workspace");
  const email = searchParams.get("email");
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 3;

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

  const { handleSubmit, isLoading } = useInviteSubmit(workspaceId, email);

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === TOTAL_STEPS) {
      await handleSubmit({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        password: updatedData.password,
        role: updatedData.role,
        companySize: updatedData.companySize,
        referralSource: updatedData.referralSource,
        goals: updatedData.goals?.join(", ") || "",
      });
      navigate('/invite-success');
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
      loading: isLoading,
      data: formData,
    };

    switch (currentStep) {
      case 1:
        return <InviteStep1 {...commonProps} />;
      case 2:
        return <InviteStep2 {...commonProps} />;
      case 3:
        return <InviteStep3 {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      // Prevent closing the modal
      if (!value) return;
      if (onOpenChange) onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[600px] h-[600px] p-0 [&>button]:hidden">
        <div className="p-6 h-full flex flex-col">
          <DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2 text-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome to Limitless Lab!</h1>
                <p className="text-muted-foreground">Complete your account setup to get started</p>
              </div>
              <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
              {renderStep()}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}