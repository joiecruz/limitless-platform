export type MemberStatus = 'Active' | 'Pending';

export interface Member {
  id: string;
  user_id: string | null;
  email: string | null;
  role: string;
  last_active: string | null;
  status: MemberStatus;
  first_name: string | null;
  last_name: string | null;
}

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  id: string;
  email: string | null;
}

export interface WorkspaceMember {
  user_id: string;
  role: string;
  last_active: string;
  profiles: Profile;
}