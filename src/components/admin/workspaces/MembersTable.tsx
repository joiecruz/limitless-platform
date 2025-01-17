import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkspaceMember } from "./types";
import { formatDate } from "@/lib/utils";
import { DeleteMemberButton } from "@/components/settings/members/DeleteMemberButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MembersTableProps {
  members: WorkspaceMember[];
  onDeleteMember?: (userId: string) => Promise<void>;
}

export function MembersTable({ members, onDeleteMember }: MembersTableProps) {
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      return user;
    }
  });

  const { data: userRole } = useQuery({
    queryKey: ['workspace-role', members[0]?.workspace_id],
    queryFn: async () => {
      if (!members[0]?.workspace_id) return null;
      const { data, error } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', members[0].workspace_id)
        .eq('user_id', currentUser?.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      return data?.role;
    },
    enabled: !!currentUser?.id && !!members[0]?.workspace_id
  });

  const isOwner = userRole === 'owner';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.user_id}>
            <TableCell>
              {member.profiles.first_name || member.profiles.last_name
                ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`
                : 'No name provided'}
            </TableCell>
            <TableCell>{member.profiles.email}</TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
            <TableCell>{formatDate(member.created_at)}</TableCell>
            <TableCell className="text-right">
              {isOwner && onDeleteMember && member.role !== 'owner' && member.user_id !== currentUser?.id && (
                <DeleteMemberButton 
                  member={{
                    id: member.user_id,
                    workspace_id: member.workspace_id,
                    email: member.profiles.email,
                    role: member.role,
                    status: 'Active',
                    last_active: member.created_at,
                    profiles: {
                      first_name: member.profiles.first_name,
                      last_name: member.profiles.last_name,
                      email: member.profiles.email
                    }
                  }}
                  isCurrentUser={false}
                  onDelete={() => onDeleteMember(member.user_id)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}