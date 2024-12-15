export interface Workspace {
  id: string;
  name: string | null;
  slug: string | null;
}

export interface WorkspaceMemberWithWorkspace {
  workspace_id: string;
  workspaces: {
    id: string;
    name: string | null;
    slug: string | null;
  };
}