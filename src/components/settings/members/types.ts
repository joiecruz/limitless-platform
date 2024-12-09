export type TableMember = {
  role: string;
  last_active: string;
  status: 'Active' | 'Invited';
  user_id?: string;
} & (
  | {
      status: 'Active';
      profiles: {
        first_name: string | null;
        last_name: string | null;
      };
    }
  | {
      status: 'Invited';
      email: string;
    }
);