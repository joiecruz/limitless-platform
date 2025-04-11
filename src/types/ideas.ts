
export interface Idea {
  id: string;
  project_id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
  likes_count?: number;
  comments_count?: number;
  has_liked?: boolean;
}

export interface IdeaLike {
  id: string;
  idea_id: string;
  user_id: string;
  created_at: string;
}

export interface IdeaComment {
  id: string;
  idea_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}
