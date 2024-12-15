export interface InviteFormData {
  password: string;
}

export interface UserData {
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  companySize?: string;
  referralSource?: string;
  goals?: string;
}