import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignupData } from "./types";
import { Step1 } from "./steps/Step1";

export function SignupSteps() {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    workspaceName: "",
    role: "",
    companySize: "",
    referralSource: "",
    goals: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    console.log("Starting signup process with data:", {
      email: formData.email,
      role: formData.role,
      company_size: formData.companySize,
      referral_source: formData.referralSource,
      goals: formData.goals
    });
    
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: formData.role,
            company_size: formData.companySize,
            referral_source: formData.referralSource,
            goals: formData.goals
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      console.log("Signup response:", data);

      // Store email in localStorage for verify-email page
      localStorage.setItem('verificationEmail', formData.email);
      
      console.log("Navigating to verify-email page");
      navigate("/verify-email", { replace: true });

      toast({
        title: "Check your email",
        description: "We've sent you a verification link to complete your registration.",
      });
    } catch (error: any) {
      console.error("Error in handleSignup:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stepProps = {
    formData,
    handleInputChange,
    handleSelectChange,
    nextStep: handleSignup,
    loading,
  };

  return (
    <form className="space-y-6 w-full max-w-md animate-fade-in">
      <Step1 {...stepProps} />
    </form>
  );
}