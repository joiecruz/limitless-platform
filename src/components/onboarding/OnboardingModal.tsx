import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  role: string;
  companySize: string;
  goals: string[];
  referralSource: string;
  workspaceName: string;
}

const TOTAL_STEPS = 4;

export function OnboardingModal({ open = false, onOpenChange }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    role: "",
    companySize: "",
    goals: [],
    referralSource: "",
    workspaceName: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === TOTAL_STEPS) {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { error } = await supabase
          .from("profiles")
          .update({
            first_name: updatedData.firstName,
            last_name: updatedData.lastName,
            role: updatedData.role,
            company_size: updatedData.companySize,
            goals: updatedData.goals,
            referral_source: updatedData.referralSource
          })
          .eq("id", user.id);

        if (error) throw error;

        // Update workspace name if provided
        if (updatedData.workspaceName) {
          const { error: workspaceError } = await supabase
            .from("workspaces")
            .update({ name: updatedData.workspaceName })
            .eq("id", user.id);

          if (workspaceError) throw workspaceError;
        }

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });

        if (onOpenChange) onOpenChange(false);
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
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
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      case 4:
        return <Step4 {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <Progress value={progress} className="rounded-none" />
        <div className="p-6">
          <DialogHeader>
            <div className="space-y-6">
              {renderStep()}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}