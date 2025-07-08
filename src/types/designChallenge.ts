export interface DesignChallenge {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  workspace_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    email: string;
  };
}

export interface StickyNote {
  id: string;
  content: string;
  position_x: number;
  position_y: number;
  color: string;
  challenge_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    email: string;
  };
}

export type ChallengeStatus = 'in_progress' | 'completed' | 'cancelled' | 'on_hold';