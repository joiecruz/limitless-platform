export type MemberStatus = 'Active' | 'Pending';

export interface Member {
  id: string;
  user_id?: string;
  email: string | null;
  role: string;
  last_active: string;
  status: MemberStatus;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  id: string;
}

export interface WorkspaceMember {
  user_id: string;
  role: string;
  last_active: string;
  profiles: ProfileData;
}

export type TableMember = Member;