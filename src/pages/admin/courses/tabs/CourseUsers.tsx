import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EnrolledUsersTable from "./components/EnrolledUsersTable";
import UsersWithAccessTable from "./components/UsersWithAccessTable";

interface CourseUsersProps {
  courseId: string;
}

const CourseUsers = ({ courseId }: CourseUsersProps) => {
  // Query to check if user is superadmin
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (error) throw error;
      return profile;
    },
  });

  // Query for users who have explicit access
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

  // Query for enrolled users with workspace information
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
          ),
          workspace_members!inner (
            workspace:workspace_id (
              id,
              name
            )
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
        {currentUser?.is_superadmin && (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Grant Access
          </Button>
        )}
      </div>

      <Tabs defaultValue="enrolled">
        <TabsList>
          <TabsTrigger value="enrolled">
            Enrolled Users ({enrolledUsers?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="access">
            Users with Access ({usersWithAccess?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          <EnrolledUsersTable 
            enrolledUsers={enrolledUsers || []} 
            isSuperAdmin={!!currentUser?.is_superadmin} 
          />
        </TabsContent>

        <TabsContent value="access">
          <UsersWithAccessTable usersWithAccess={usersWithAccess || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseUsers;