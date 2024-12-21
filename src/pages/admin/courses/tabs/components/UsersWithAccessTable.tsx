import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserWithAccess {
  id: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

interface UsersWithAccessTableProps {
  usersWithAccess: UserWithAccess[];
  courseId: string;
  onAccessRevoked: () => void;
}

const UsersWithAccessTable = ({ usersWithAccess, courseId, onAccessRevoked }: UsersWithAccessTableProps) => {
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRevokeAccess = async (accessId: string, email: string) => {
    try {
      setIsRevoking(accessId);

      const { error } = await supabase
        .from("user_course_access")
        .delete()
        .eq("id", accessId);

      if (error) throw error;

      toast({
        title: "Access revoked",
        description: `Successfully revoked access for ${email}`,
      });

      onAccessRevoked();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke access",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(null);
    }
  };

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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRevokeAccess(access.id, access.profiles.email)}
                disabled={isRevoking === access.id}
              >
                {isRevoking === access.id ? "Revoking..." : "Revoke Access"}
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