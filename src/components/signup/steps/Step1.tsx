import { useState } from "react";
import { TextStep } from "./TextStep";
import { SignupData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useSignupValidation } from "@/hooks/useSignupValidation";
import { PasswordInput } from "../components/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Step1Props {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  loading: boolean;
  emailExists?: boolean;
}

export const Step1 = ({ formData, handleInputChange, nextStep, loading, emailExists }: Step1Props) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateEmail, validatePassword, isFormValid } = useSignupValidation();

  const handleNext = async () => {
    const newErrors: { [key: string]: string } = {};
    setIsChecking(true);
    
    try {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
      
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
    <>
      {emailExists && (
        <div className="mb-4">
          <Alert variant="destructive" className="animate-in fade-in-0 duration-300">
            <AlertDescription className="flex items-center justify-between">
              <span>This email is already registered.</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/signin")}
              >
                Sign in instead
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
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
          }
        ]}
        values={formData}
        onChange={handleInputChange}
        onNext={handleNext}
        loading={loading || isChecking}
        fieldsContainerClassName="flex gap-4 flex-wrap"
        isNextDisabled={!isFormValid(formData) || emailExists}
        customFields={[
          <PasswordInput
            key="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            disabled={loading}
          />
        ]}
      />
    </>
  );
};