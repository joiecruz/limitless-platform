import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserWithAccess {
  id: string;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

interface UsersWithAccessTableProps {
  usersWithAccess: UserWithAccess[];
}

const UsersWithAccessTable = ({ usersWithAccess }: UsersWithAccessTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Granted At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersWithAccess?.map((access) => (
          <TableRow key={access.id}>
            <TableCell>
              {access.profiles?.first_name} {access.profiles?.last_name}
            </TableCell>
            <TableCell>{access.profiles?.email}</TableCell>
            <TableCell>
              {new Date(access.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button variant="destructive" size="sm">
                Revoke Access
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {usersWithAccess?.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground"
            >
              No users with explicit access found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersWithAccessTable;