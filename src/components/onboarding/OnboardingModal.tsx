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
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === TOTAL_STEPS) {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        // Update profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            first_name: updatedData.firstName,
            last_name: updatedData.lastName,
            role: updatedData.role,
            company_size: updatedData.companySize,
            goals: JSON.stringify(updatedData.goals), // Convert array to string
            referral_source: updatedData.referralSource
          })
          .eq("id", user.id);

        if (profileError) throw profileError;

        // Create workspace with unique slug
        const slug = generateSlug(updatedData.workspaceName);
        const { data: workspace, error: workspaceError } = await supabase
          .from("workspaces")
          .insert({
            name: updatedData.workspaceName,
            slug: `${slug}-${Date.now()}`
          })
          .select()
          .single();

        if (workspaceError) throw workspaceError;

        // Add user as workspace owner
        const { error: memberError } = await supabase
          .from("workspace_members")
          .insert({
            workspace_id: workspace.id,
            user_id: user.id,
            role: 'owner'
          });

        if (memberError) throw memberError;

        // Invalidate queries to refresh workspace data
        await queryClient.invalidateQueries({ queryKey: ['workspaces'] });

        toast({
          title: "Setup complete",
          description: "Your profile and workspace have been created successfully.",
        });

        if (onOpenChange) onOpenChange(false);
      } catch (error: any) {
        console.error("Error in onboarding:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to complete setup",
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
      <DialogContent className="sm:max-w-[600px] h-[500px] p-0" showClose={false}>
        <div className="p-6 h-full flex flex-col">
          <DialogHeader>
            <div className="space-y-4">
              <Progress value={progress} className="h-1 w-full" />
              {renderStep()}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}