export interface SignupData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: string;
  goals: string[];
  referralSource: string;
  workspaceName: string;
}

export interface SignupStepProps {
  onNext: (data: Partial<SignupFormData>) => void;
  onBack?: () => void;
  data: SignupFormData;
  loading?: boolean;
}
