import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WorkspaceMember {
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email?: string;
  };
  role: string;
  last_active: string;
}

interface MembersTableProps {
  members: WorkspaceMember[];
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => (
          <TableRow key={index}>
            <TableCell>
              {member.profiles.first_name || member.profiles.last_name 
                ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim()
                : 'Unnamed Member'}
            </TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(member.last_active), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}