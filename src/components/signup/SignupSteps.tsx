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
  });
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check email existence when email field changes
    if (name === 'email' && value) {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          shouldCreateUser: false,
        }
      });
      
      // If we get data back, it means the email exists
      setEmailExists(!!data.user);
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (emailExists) {
      toast({
        title: "Account exists",
        description: "This email is already registered. Please sign in instead.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Starting signup process with data:", {
      email: formData.email,
    });
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        }
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup response:", data);

      if (data?.user) {
        // Store email in localStorage for verify-email page
        localStorage.setItem('verificationEmail', formData.email);
        
        console.log("Navigating to verify-email page");
        navigate("/verify-email");

        toast({
          title: "Check your email",
          description: "We've sent you a verification link to complete your registration.",
        });
      } else {
        throw new Error("No user data returned from signup");
      }
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
    nextStep: handleSignup,
    loading,
    emailExists,
  };

  return (
    <form className="space-y-6 w-full max-w-md animate-fade-in">
      <Step1 {...stepProps} />
    </form>
  );
}