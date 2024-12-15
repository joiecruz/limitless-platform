export interface Workspace {
  id: string;
  name: string | null;
  slug: string | null;
}

export interface WorkspaceMemberWithWorkspace {
  workspace: {
    id: string;
    name: string | null;
    slug: string | null;
  };
}