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
import { useToast } from "@/hooks/use-toast";

interface CourseWorkspacesProps {
  courseId: string;
}

const CourseWorkspaces = ({ courseId }: CourseWorkspacesProps) => {
  const { toast } = useToast();
  const { data: workspaces, isLoading, refetch } = useQuery({
    queryKey: ["course-workspaces", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_course_access")
        .select(`
          *,
          workspaces:workspace_id (
            id,
            name,
            slug,
            workspace_members (
              count
            )
          )
        `)
        .eq("course_id", courseId);

      if (error) throw error;
      return data;
    },
  });

  const handleRevokeAccess = async (accessId: string) => {
    try {
      const { error } = await supabase
        .from("workspace_course_access")
        .delete()
        .eq("id", accessId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workspace access revoked successfully",
      });
      refetch();
    } catch (error) {
      console.error("Error revoking access:", error);
      toast({
        title: "Error",
        description: "Failed to revoke workspace access",
        variant: "destructive",
      });
    }
  };

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
            <TableHead>Members</TableHead>
            <TableHead>Granted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces?.map((access) => (
            <TableRow key={access.id}>
              <TableCell>{access.workspaces?.name}</TableCell>
              <TableCell>{access.workspaces?.slug}</TableCell>
              <TableCell>
                {access.workspaces?.workspace_members?.[0]?.count || 0}
              </TableCell>
              <TableCell>
                {new Date(access.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRevokeAccess(access.id)}
                >
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