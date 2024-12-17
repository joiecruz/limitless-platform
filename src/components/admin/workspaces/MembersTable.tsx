import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkspaceMember } from "./types";
import { formatDate } from "@/lib/utils";
import { DeleteMemberButton } from "@/components/settings/members/DeleteMemberButton";

interface MembersTableProps {
  members: WorkspaceMember[];
  onDeleteMember?: (userId: string) => Promise<void>;
}

export function MembersTable({ members, onDeleteMember }: MembersTableProps) {
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
              {onDeleteMember && member.role !== 'owner' && (
                <DeleteMemberButton onDelete={() => onDeleteMember(member.user_id)} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}