
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  coverImage?: string;
  currentPhase?: string;
  workspaceId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  backgroundColor?: string;
  iconName?: string;
}
