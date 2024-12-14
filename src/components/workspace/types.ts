export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export interface WorkspaceMemberWithWorkspace {
  workspace: {
    id: string;
    name: string | null;
    slug: string | null;
  };
}