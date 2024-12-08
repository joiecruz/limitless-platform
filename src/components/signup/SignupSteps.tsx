import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignupData } from "./types";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
} from "./SignupFormSteps";

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
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (error) throw error;

      setStep(2);
      toast({
        title: "Verification code sent!",
        description: "Please check your email for the verification code.",
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
      // For now, we'll just move to the next step
      setStep(3);
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
      // Here you would implement the resend code logic
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

  const nextStep = () => {
    if (step === 1) {
      handleInitialSignup();
    } else {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          role: formData.role,
          company_size: formData.companySize,
          referral_source: formData.referralSource,
          goals: formData.goals,
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your account has been set up successfully.",
      });
      
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md animate-fade-in">
      {step === 1 && <Step1 {...stepProps} />}
      {step === 2 && <Step2 {...stepProps} />}
      {step === 3 && <Step3 {...stepProps} />}
      {step === 4 && <Step4 {...stepProps} />}
      {step === 5 && <Step5 {...stepProps} />}
      {step === 6 && <Step6 {...stepProps} />}
    </form>
  );
}