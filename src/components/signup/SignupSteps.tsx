import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Step1 from "./steps/Step1";
import { useSignupValidation } from "@/hooks/useSignupValidation";

export function SignupSteps() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { validateStep1 } = useSignupValidation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      console.log("Validating signup data...");
      
      // Validate form data
      const validationError = validateStep1(formData);
      if (validationError) {
        toast({
          title: "Validation Error",
          description: validationError,
          variant: "destructive",
        });
        return;
      }

      console.log("Signing up with Supabase...");
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      console.log("Signup successful, storing email for verification...");
      // Store email for verification page
      localStorage.setItem('verificationEmail', formData.email);
      
      console.log("Navigating to verify-email page");
      navigate("/verify-email", { replace: true });

      toast({
        title: "Check your email",
        description: "We've sent you a verification link to complete your registration.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
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
    loading,
    onInputChange: handleInputChange,
  };

  return (
    <form 
      className="space-y-6 w-full max-w-md animate-fade-in" 
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
    >
      <Step1 {...stepProps} />
    </form>
  );
}