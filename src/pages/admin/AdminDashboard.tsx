import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: workspacesCount },
        { count: coursesCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('workspaces').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: usersCount,
        workspaces: workspacesCount,
        courses: coursesCount
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{stats?.users || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Workspaces</h3>
          <p className="text-3xl font-bold text-primary">{stats?.workspaces || 0}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-primary">{stats?.courses || 0}</p>
        </Card>
      </div>
    </div>
  );
}