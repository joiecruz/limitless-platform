export type MemberStatus = 'Active' | 'Pending';

export interface Member {
  id: string;
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