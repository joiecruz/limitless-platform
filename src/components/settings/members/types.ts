export type MemberStatus = 'Active' | 'Pending';

export interface Member {
  id: string;
  user_id?: string; // Added this field
  email: string | null;
  role: string;
  last_active: string;
  status: MemberStatus;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

export type TableMember = Member;