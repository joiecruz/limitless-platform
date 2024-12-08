import { useState } from "react";
import { TextStep } from "./TextStep";
import { SignupData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Step1Props {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
}

export const Step1 = ({ formData, handleInputChange, nextStep }: Step1Props) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /[a-z]/, message: "one lowercase character" },
      { regex: /[A-Z]/, message: "one uppercase character" },
      { regex: /\d/, message: "one number" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "one special character" },
      { regex: /.{8,}/, message: "8 characters minimum" },
    ];

    const failedRequirements = requirements.filter(req => !req.regex.test(password));
    return failedRequirements.length === 0 ? "" : `Password must contain ${failedRequirements.map(r => r.message).join(", ")}`;
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const isFormValid = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    return !emailError && !passwordError && !isChecking;
  };

  const checkEmailExists = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });
      
      if (error && error.message.includes("User not found")) {
        return false; // Email doesn't exist
      }
      return true; // Email exists
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleNext = async () => {
    const newErrors: { [key: string]: string } = {};
    setIsChecking(true);
    
    try {
      // Email format validation
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      } else {
        // Check if email already exists
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          newErrors.email = "This email is already registered";
          toast({
            title: "Email already exists",
            description: "Please use a different email address or sign in.",
            variant: "destructive",
          });
        }
      }
      
      // Password validation
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        nextStep();
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Error",
        description: "An error occurred while validating your information",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <TextStep
      fields={[
        {
          name: "email",
          label: "Work Email",
          type: "email",
          placeholder: "you@company.com",
          required: true,
          containerClassName: "w-full",
          error: errors.email,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "••••••••",
          required: true,
          containerClassName: "w-full",
          error: errors.password,
        }
      ]}
      values={formData}
      onChange={handleInputChange}
      onNext={handleNext}
      loading={isChecking}
      fieldsContainerClassName="flex gap-4 flex-wrap"
      isNextDisabled={!isFormValid()}
    />
  );
};