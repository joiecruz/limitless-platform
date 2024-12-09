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

interface MembersTableProps {
  members: TableMember[];
  onDeleteMember: (member: TableMember) => void;
}

export function MembersTable({ members, onDeleteMember }: MembersTableProps) {
  const currentUser = useCurrentUser();

  const isCurrentUser = (member: TableMember) => {
    if (member.status === 'Active' && currentUser) {
      return member.user_id === currentUser;
    }
    return false;
  };

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
          />
        ))}
      </TableBody>
    </Table>
  );
}