export interface WorkspaceMember {
  user_id: string;
  role: string;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

export interface Workspace {
  id: string;
  name: string;
}