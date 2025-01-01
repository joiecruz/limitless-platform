import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignupData } from "./types";
import { Step1 } from "./steps/Step1";
import { debounce } from "lodash";

export function SignupSteps() {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debounced email check function
  const checkEmailExists = useCallback(
    debounce(async (email: string) => {
      if (!email) {
        setEmailExists(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          }
        });
        
        if (!error) {
          setEmailExists(!!data.user);
        }
      } catch (error) {
        console.error("Error checking email:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      checkEmailExists(value);
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
      // Get the current domain
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/verify-email`;
      
      console.log("Signup redirect URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            email_confirmed_at: null // Ensure email needs verification
          }
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