
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { useOnboardingSubmit } from "./hooks/useOnboardingSubmit";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { OnboardingData } from "./types";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isIncompleteProfile?: boolean;
}

export function OnboardingModal({ open = false, onOpenChange, isIncompleteProfile = false }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const { toast } = useToast();
  
  // Get state from location or set defaults
  const isInvitedUser = location.state?.isInvited === true;
  const showOnboarding = location.state?.showOnboarding ?? true;
  
  console.log('[OnboardingModal] isIncompleteProfile:', isIncompleteProfile);
  console.log('[OnboardingModal] isInvitedUser:', isInvitedUser);
  console.log('[OnboardingModal] location.state:', location.state);
  console.log('[OnboardingModal] showOnboarding:', showOnboarding);
  
  // Only hide workspace creation step if user is invited (they'll be added to an existing workspace)
  // Incomplete profile users should still see workspace step unless they're invited users
  const shouldShowWorkspaceStep = !isInvitedUser;
  const TOTAL_STEPS = shouldShowWorkspaceStep ? 4 : 3;
  
  console.log('[OnboardingModal] shouldShowWorkspaceStep:', shouldShowWorkspaceStep);
  console.log('[OnboardingModal] TOTAL_STEPS:', TOTAL_STEPS);

  useEffect(() => {
    // Reset to step 1 when modal opens
    if (open) {
      setCurrentStep(1);
    }
  }, [open]);

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    role: "",
    companySize: "",
    goals: [],
    referralSource: "",
    workspaceName: shouldShowWorkspaceStep ? "" : undefined,
    password: "",
  });

  const { handleSubmit, loading } = useOnboardingSubmit({ onOpenChange });

  const addUserToSysteme = async (userId: string) => {
    try {
      console.log("[Onboarding] Adding user to Systeme.io:", userId);
      const { data, error } = await supabase.functions.invoke('handle-systeme-signup', {
        body: { user_id: userId }
      });
      
      if (error) {
        console.error('[Onboarding] Error adding user to Systeme.io:', error);
        // Don't show an error toast as this is non-critical
        return;
      }
      
      if (!data.success) {
        console.warn('[Onboarding] Systeme.io integration responded with non-success:', data);
        // Don't show an error toast as this is non-critical
        return;
      }
      
      console.log('[Onboarding] Successfully added user to Systeme.io:', data);
    } catch (e) {
      console.error('[Onboarding] Exception adding user to Systeme.io:', e);
      // Don't show an error toast as this is non-critical
    }
  };

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    console.log('[OnboardingModal] Current step:', currentStep, 'Total steps:', TOTAL_STEPS);
    console.log('[OnboardingModal] Form data:', updatedData);

    if (currentStep === TOTAL_STEPS) {
      // Call systeme.io integration right before submitting the form
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          // Call Systeme.io integration but don't await it to not block the user flow
          addUserToSysteme(data.user.id).catch(err => {
            console.error("Background Systeme.io error:", err);
            // Don't show toast to user as this is non-critical
          });
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
      
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
        return shouldShowWorkspaceStep ? <Step4 {...commonProps} /> : null;
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
