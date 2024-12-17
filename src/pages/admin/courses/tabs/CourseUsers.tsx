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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CourseUsersProps {
  courseId: string;
}

const CourseUsers = ({ courseId }: CourseUsersProps) => {
  const { data: enrolledUsers, isLoading: isLoadingEnrolled } = useQuery({
    queryKey: ["course-enrolled-users", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
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

  const { data: usersWithAccess, isLoading: isLoadingAccess } = useQuery({
    queryKey: ["course-users-access", courseId],
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

  if (isLoadingEnrolled || isLoadingAccess) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
      </div>

      <Tabs defaultValue="enrolled">
        <TabsList>
          <TabsTrigger value="enrolled">Enrolled Users</TabsTrigger>
          <TabsTrigger value="access">Users with Access</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Enrolled At</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="access">
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
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseUsers;