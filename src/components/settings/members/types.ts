export interface WorkspaceMember {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
  role: string;
  last_active: string;
  status: 'Active';
}

export interface WorkspaceInvitation {
  email: string;
  role: string;
  status: 'Invited';
  last_active: string;
}

export type TableMember = WorkspaceMember | WorkspaceInvitation;