import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { TableMember } from "./types";
import { DeleteMemberButton } from "./DeleteMemberButton";

interface MemberRowProps {
  member: TableMember;
  isCurrentUser: boolean;
  onDelete: (member: TableMember) => void;
}

export function MemberRow({ member, isCurrentUser, onDelete }: MemberRowProps) {
  return (
    <TableRow>
      <TableCell>
        {member.status === 'Active' && 'profiles' in member
          ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim() || 'Unnamed Member'
          : 'Pending Member'}
      </TableCell>
      <TableCell>
        {member.status === 'Active' 
          ? 'Email not available'
          : member.email}
      </TableCell>
      <TableCell className="capitalize">{member.role}</TableCell>
      <TableCell>
        <Badge variant={member.status === 'Active' ? "default" : "secondary"}>
          {member.status}
        </Badge>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(member.last_active), { addSuffix: true })}
      </TableCell>
      <TableCell>
        <DeleteMemberButton
          member={member}
          isCurrentUser={isCurrentUser}
          onDelete={() => onDelete(member)}
        />
      </TableCell>
    </TableRow>
  );
}