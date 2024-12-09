import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TableMember {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email?: string;
  };
  email?: string;
  role: string;
  last_active: string;
  status: 'Active' | 'Invited';
}

interface MembersTableProps {
  members: TableMember[];
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => (
          <TableRow key={index}>
            <TableCell>
              {member.status === 'Active' && member.profiles
                ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim() || 'Unnamed Member'
                : 'Pending Member'}
            </TableCell>
            <TableCell>
              {member.status === 'Active' ? member.profiles?.email : member.email}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}