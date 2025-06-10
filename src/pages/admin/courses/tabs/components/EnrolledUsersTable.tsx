import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface EnrolledUser {
  id: string;
  progress: number;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    workspace_members: Array<{
      workspace: {
        id: string;
        name: string;
      };
    }>;
  };
}

interface EnrolledUsersTableProps {
  enrolledUsers: EnrolledUser[];
  isSuperAdmin: boolean;
  courseId: string;
  onEnrollmentRevoked: () => void;
}

const EnrolledUsersTable = ({ enrolledUsers, isSuperAdmin, courseId, onEnrollmentRevoked }: EnrolledUsersTableProps) => {
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRevokeEnrollment = async (enrollmentId: string, email: string) => {
    try {
      setRevokingId(enrollmentId);

      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", enrollmentId);

      if (error) throw error;

      // Invalidate course counts to update enrollment numbers immediately
      queryClient.invalidateQueries({ queryKey: ["course-counts", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["course-enrolled-users", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["featured-courses"] });

      toast({
        title: "Enrollment revoked",
        description: `Successfully revoked enrollment for ${email}`,
      });

      onEnrollmentRevoked();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke enrollment",
        variant: "destructive",
      });
    } finally {
      setRevokingId(null);
    }
  };

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
          {isSuperAdmin && <TableHead>Actions</TableHead>}
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
                {enrollment.profiles?.workspace_members?.[0]?.workspace?.name || 'N/A'}
              </TableCell>
            )}
            {isSuperAdmin && (
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRevokeEnrollment(enrollment.id, enrollment.profiles.email)}
                  disabled={revokingId === enrollment.id}
                >
                  {revokingId === enrollment.id ? "Revoking..." : "Revoke Enrollment"}
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
        {enrolledUsers?.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={isSuperAdmin ? 7 : 5}
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