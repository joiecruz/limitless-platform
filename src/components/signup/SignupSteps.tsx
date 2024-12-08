import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignupData } from "./types";
import { Step1, Step2 } from "./SignupFormSteps";

export function SignupSteps() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    workspaceName: "",
    role: "",
    companySize: "",
    referralSource: "",
    goals: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleInitialSignup = async () => {
    setLoading(true);
    try {
      console.log("Signing up with data:", {
        email: formData.email,
        metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          company_size: formData.companySize,
          referral_source: formData.referralSource,
          goals: formData.goals,
        }
      });

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
            company_size: formData.companySize,
            referral_source: formData.referralSource,
            goals: formData.goals,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      try {
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            to: [formData.email],
            subject: "Verify your email",
            verificationCode,
          },
        });

        if (emailError) throw emailError;

        setStep(2);
        toast({
          title: "Verification code sent!",
          description: "Please check your email for the verification code.",
        });
      } catch (emailError: any) {
        toast({
          title: "Error sending verification email",
          description: emailError.message || "Failed to send verification email",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would verify the code with your backend
      // For now, we'll just navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: [formData.email],
          subject: "Verify your email",
          verificationCode,
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "Code resent!",
        description: "Please check your email for the new verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (step === 1) {
      handleInitialSignup();
    }
  };
  
  const prevStep = () => setStep(step - 1);

  const stepProps = {
    formData,
    handleInputChange,
    handleSelectChange,
    nextStep,
    prevStep,
    loading,
    verificationCode,
    setVerificationCode,
    handleVerification,
    handleResendCode,
    handleLogout,
  };

  return (
    <form className="space-y-6 w-full max-w-md animate-fade-in">
      {step === 1 && <Step1 {...stepProps} />}
      {step === 2 && <Step2 {...stepProps} />}
    </form>
  );
}