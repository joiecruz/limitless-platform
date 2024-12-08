import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { SignupData } from "./types";

interface StepProps {
  formData: SignupData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  loading?: boolean;
  verificationCode?: string;
  setVerificationCode?: (code: string) => void;
  handleVerification?: () => void;
  handleResendCode?: () => void;
}

// Export all steps
export { Step1, Step2 };