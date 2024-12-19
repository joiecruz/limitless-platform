import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EnrolledUser {
  id: string;
  progress: number;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  workspace_members?: Array<{
    workspace: {
      id: string;
      name: string;
    };
  }>;
}

interface EnrolledUsersTableProps {
  enrolledUsers: EnrolledUser[];
  isSuperAdmin: boolean;
}

const EnrolledUsersTable = ({ enrolledUsers, isSuperAdmin }: EnrolledUsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Enrolled At</TableHead>
          <TableHead>Status</TableHead>
          {isSuperAdmin && <TableHead>Workspace</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrolledUsers?.map((enrollment) => (
          <TableRow key={enrollment.id}>
            <TableCell>
              {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
            </TableCell>
            <TableCell>{enrollment.profiles?.email}</TableCell>
            <TableCell>{enrollment.progress || 0}%</TableCell>
            <TableCell>
              {new Date(enrollment.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {enrollment.progress === 100 ? (
                <span className="text-green-600 font-medium">Completed</span>
              ) : enrollment.progress > 0 ? (
                <span className="text-blue-600 font-medium">In Progress</span>
              ) : (
                <span className="text-gray-600">Not Started</span>
              )}
            </TableCell>
            {isSuperAdmin && (
              <TableCell>
                {enrollment.workspace_members?.[0]?.workspace?.name || 'N/A'}
              </TableCell>
            )}
          </TableRow>
        ))}
        {enrolledUsers?.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={isSuperAdmin ? 6 : 5}
              className="text-center text-muted-foreground"
            >
              No enrolled users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EnrolledUsersTable;