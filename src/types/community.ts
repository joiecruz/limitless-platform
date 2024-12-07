export interface Channel {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string | null;
}

export interface Message {
  id: string;
  content: string;
  channel_id: string;
  user_id: string;
  created_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
}