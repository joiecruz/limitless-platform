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
              {onDeleteMember && member.role !== 'owner' && member.user_id !== currentUser?.id && (
                <DeleteMemberButton 
                  member={{
                    id: member.user_id,
                    email: member.profiles.email,
                    role: member.role,
                    status: 'Active',
                    last_active: member.created_at,
                    profiles: {
                      first_name: member.profiles.first_name,
                      last_name: member.profiles.last_name
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