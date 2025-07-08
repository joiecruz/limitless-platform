
// Onboarding data interface for user registration flow
export interface OnboardingData {
  firstName: string;
  lastName: string;
  role: string;
  companySize: string;
  goals: string[];
  referralSource: string;
  workspaceName: string | undefined;
}
