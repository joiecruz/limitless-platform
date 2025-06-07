
export interface OnboardingData {
  firstName: string;
  lastName: string;
  role: string;
  companySize: string;
  goals: string[] | string;
  referralSource: string;
  workspaceName: string | undefined;
  password?: string;
}
