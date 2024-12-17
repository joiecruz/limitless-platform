import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";

interface CourseUsersProps {
  courseId: string;
}

const CourseUsers = ({ courseId }: CourseUsersProps) => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["course-users", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_course_access")
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq("course_id", courseId);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users with Access</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
      </div>

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
          {users?.map((access) => (
            <TableRow key={access.id}>
              <TableCell>
                {access.profiles?.first_name} {access.profiles?.last_name}
              </TableCell>
              <TableCell>{access.profiles?.email}</TableCell>
              <TableCell>{new Date(access.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm">
                  Revoke Access
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseUsers;