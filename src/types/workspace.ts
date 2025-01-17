export interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface SupabaseWorkspaceMember {
  user_id: string;
  role: string;
  created_at: string;
  profiles: ProfileData;
}

export interface WorkspaceMember {
  user_id: string;
  role: string;
  created_at: string;
  profiles: ProfileData;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}