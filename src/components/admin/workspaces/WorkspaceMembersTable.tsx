import { WorkspaceMember } from "@/types/workspace";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WorkspaceMembersTableProps {
  workspaceId: string;
}

export function WorkspaceMembersTable({ workspaceId }: WorkspaceMembersTableProps) {
  const { data: members, isLoading, error } = useWorkspaceMembers(workspaceId);

  if (isLoading) {
    return <div>Loading members...</div>;
  }

  if (error) {
    return <div>Error loading members: {error.message}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.map((member: WorkspaceMember) => (
          <TableRow key={member.user_id}>
            <TableCell>
              {member.profiles.first_name} {member.profiles.last_name}
            </TableCell>
            <TableCell>{member.profiles.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}