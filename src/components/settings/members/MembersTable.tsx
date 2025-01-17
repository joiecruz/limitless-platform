import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableMember } from "./types";
import { MemberRow } from "./MemberRow";
import { useCurrentUser } from "./useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MembersTableProps {
  members: TableMember[];
  onDeleteMember: (member: TableMember) => void;
}

export function MembersTable({ members, onDeleteMember }: MembersTableProps) {
  const currentUser = useCurrentUser();
  
  // Fetch current user's role in the workspace
  const { data: userRole } = useQuery({
    queryKey: ['workspace-role', members[0]?.workspace_id],
    queryFn: async () => {
      if (!members[0]?.workspace_id) return null;
      
      const { data, error } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', members[0].workspace_id)
        .eq('user_id', currentUser)
        .single();
        
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data?.role;
    },
    enabled: !!currentUser && !!members[0]?.workspace_id
  });

  const isCurrentUser = (member: TableMember) => {
    if (member.status === 'Active' && currentUser) {
      return member.user_id === currentUser;
    }
    return false;
  };

  const canDeleteMember = userRole === 'owner';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => (
          <MemberRow
            key={index}
            member={member}
            isCurrentUser={isCurrentUser(member)}
            onDelete={onDeleteMember}
            canDelete={canDeleteMember && member.role !== 'owner'}
          />
        ))}
      </TableBody>
    </Table>
  );
}