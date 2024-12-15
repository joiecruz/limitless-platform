export interface Workspace {
  id: string;
  name: string | null;
  slug: string | null;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: string;
  workspaces: Workspace;  // Changed from Workspace to single object
}