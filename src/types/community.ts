export interface Channel {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string | null;
  is_public: boolean;
  read_only?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  user_id: string;
  message_id?: string;
  created_at?: string;
}

export interface Message {
  id: string;
  content: string;
  channel_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  edited_at?: string;
  image_url: string | null;
  parent_id: string | null;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
  message_reactions?: MessageReaction[];
}