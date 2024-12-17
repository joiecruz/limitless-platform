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
import { Building, Loader2 } from "lucide-react";

interface CourseWorkspacesProps {
  courseId: string;
}

const CourseWorkspaces = ({ courseId }: CourseWorkspacesProps) => {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["course-workspaces", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_course_access")
        .select(`
          *,
          workspaces:workspace_id (
            id,
            name,
            slug
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
        <h2 className="text-xl font-semibold">Workspace Access</h2>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          Add Workspace
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workspace</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Granted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces?.map((access) => (
            <TableRow key={access.id}>
              <TableCell>{access.workspaces?.name}</TableCell>
              <TableCell>{access.workspaces?.slug}</TableCell>
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

export default CourseWorkspaces;