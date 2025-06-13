
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import EnrolledUsersTable from "./components/EnrolledUsersTable";
import UsersWithAccessTable from "./components/UsersWithAccessTable";

interface CourseUsersProps {
  courseId: string;
}

interface EnrolledUser {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  created_at: string;
  updated_at: string;
  completed_lessons: string[];
  profiles: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    workspace_members: Array<{
      workspace: {
        id: string;
        name: string;
      };
    }>;
  };
}

interface UserWithAccess {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  profiles: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

const CourseUsers = ({ courseId }: CourseUsersProps) => {
  // Fetch enrolled users
  const { data: enrolledUsers = [], isLoading: enrolledLoading } = useQuery({
    queryKey: ["course-enrolled-users", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          profiles!inner (
            id,
            email,
            first_name,
            last_name,
            workspace_members (
              workspace:workspaces (
                id,
                name
              )
            )
          )
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching enrolled users:", error);
        throw error;
      }

      console.log("Enrolled users data:", data);
      return data as EnrolledUser[];
    },
  });

  // Fetch users with explicit access
  const { data: usersWithAccess = [], isLoading: accessLoading } = useQuery({
    queryKey: ["course-access-users", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_course_access")
        .select(`
          *,
          profiles!inner (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching users with access:", error);
        throw error;
      }

      console.log("Users with access data:", data);
      return data as UserWithAccess[];
    },
  });

  // Fetch workspaces with access
  const { data: workspacesWithAccess = [], isLoading: workspaceAccessLoading } = useQuery({
    queryKey: ["course-workspace-access", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_course_access")
        .select(`
          *,
          workspaces!inner (
            id,
            name
          )
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching workspaces with access:", error);
        throw error;
      }

      return data || [];
    },
  });

  if (enrolledLoading || accessLoading || workspaceAccessLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individual Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWithAccess.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspace Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspacesWithAccess.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Users</CardTitle>
        </CardHeader>
        <CardContent>
          <EnrolledUsersTable users={enrolledUsers} />
        </CardContent>
      </Card>

      {/* Users with Access Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users with Individual Access</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersWithAccessTable users={usersWithAccess} courseId={courseId} />
        </CardContent>
      </Card>

      {/* Workspaces with Access */}
      <Card>
        <CardHeader>
          <CardTitle>Workspaces with Access</CardTitle>
        </CardHeader>
        <CardContent>
          {workspacesWithAccess.length > 0 ? (
            <div className="space-y-2">
              {workspacesWithAccess.map((access) => (
                <div key={access.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{access.workspaces.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Access granted on {new Date(access.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Workspace Access</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No workspaces have access to this course.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseUsers;
