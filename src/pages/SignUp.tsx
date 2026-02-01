import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SignupLayout } from "@/components/signup/SignupLayout";
import { SignupStep1 } from "@/components/signup/SignupStep1";
import { SignupStep2 } from "@/components/signup/SignupStep2";
import { SignupStep3 } from "@/components/signup/SignupStep3";
import { SignupStep4 } from "@/components/signup/SignupStep4";
import { SignupFormData } from "@/components/signup/types";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    companyName: "",
    role: "",
    goals: [],
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEmailVerified = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setCurrentStep(2);
  };

  const handlePasswordSet = (firstName: string, lastName: string, password: string) => {
    setFormData(prev => ({ ...prev, firstName, lastName, password }));
    setCurrentStep(3);
  };

  const handleCompanyInfoSet = (companyName: string, role: string) => {
    setFormData(prev => ({ ...prev, companyName, role }));
    setCurrentStep(4);
  };

  const handleComplete = async (goals: string[]) => {
    setLoading(true);
    const updatedFormData = { ...formData, goals };
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User not found");
      }

      // Update profile with all collected data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || updatedFormData.email,
          first_name: updatedFormData.firstName,
          last_name: updatedFormData.lastName,
          role: updatedFormData.role,
          company_size: updatedFormData.companyName, // Using company_size field to store company name
          goals: goals.join(', '),
        });

      if (profileError) throw profileError;

      // Create workspace with company name
      if (updatedFormData.companyName) {
        const slug = updatedFormData.companyName.toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '') +
          '-' + Date.now();

        const { error: workspaceError } = await supabase
          .rpc('create_workspace_with_owner', {
            workspace_name: updatedFormData.companyName.trim(),
            workspace_slug: slug,
            owner_id: user.id
          });

        if (workspaceError) {
          console.error('Workspace creation error:', workspaceError);
          // Don't throw - workspace creation is non-critical
        }
      }

      // Track signup completion event
      await supabase
        .from('events')
        .insert({
          user_id: user.id,
          event_type: 'signup_completed',
          event_data: {
            goals: goals,
            role: updatedFormData.role,
            has_workspace: !!updatedFormData.companyName,
          }
        });

      // Call systeme.io integration (non-blocking)
      supabase.functions.invoke('handle-systeme-signup', {
        body: { user_id: user.id }
      }).catch(err => {
        console.error('Systeme.io integration error:', err);
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['user-workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      // Mark onboarding as completed
      localStorage.setItem('onboardingCompleted', Date.now().toString());
      localStorage.setItem('dashboard-visited', 'true');

      toast({
        title: "Welcome to Limitless Lab!",
        description: "Your account has been set up successfully.",
      });

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error('Signup completion error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignupStep1
            data={formData}
            onNext={() => {}}
            onEmailVerified={handleEmailVerified}
          />
        );
      case 2:
        return (
          <SignupStep2
            data={formData}
            onNext={() => {}}
            onBack={handleBack}
            onPasswordSet={handlePasswordSet}
          />
        );
      case 3:
        return (
          <SignupStep3
            data={formData}
            onNext={() => {}}
            onBack={handleBack}
            onCompanyInfoSet={handleCompanyInfoSet}
          />
        );
      case 4:
        return (
          <SignupStep4
            data={formData}
            onNext={() => {}}
            onBack={handleBack}
            onComplete={handleComplete}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SignupLayout 
      currentStep={currentStep} 
      totalSteps={4}
      showProgress={currentStep > 1}
    >
      {renderStep()}
    </SignupLayout>
  );
}
