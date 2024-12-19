import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { WorkspaceList } from "@/components/workspace/WorkspaceList";
import { useWorkspaces } from "@/components/workspace/useWorkspaces";
import { Workspace } from "@/components/workspace/types";

interface CourseWorkspacesProps {
  courseId: string;
}

const CourseWorkspaces = ({ courseId }: CourseWorkspacesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: workspaces, isError: workspacesError } = useWorkspaces();

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

  const { data: workspaceAccess, isLoading, refetch } = useQuery({
    queryKey: ["course-workspaces", courseId],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching workspace access:", error);
        toast({
          title: "Error",
          description: "Failed to load workspace access data",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const handleAddWorkspace = async (workspace: Workspace) => {
    try {
      // Check if access already exists
      const { data: existingAccess } = await supabase
        .from("workspace_course_access")
        .select("id")
        .eq("workspace_id", workspace.id)
        .eq("course_id", courseId)
        .single();

      if (existingAccess) {
        toast({
          title: "Error",
          description: "This workspace already has access to the course",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("workspace_course_access")
        .insert({
          workspace_id: workspace.id,
          course_id: courseId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workspace access granted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["course-workspaces", courseId] });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error granting workspace access:", error);
      toast({
        title: "Error",
        description: "Failed to grant workspace access",
        variant: "destructive",
      });
    }
  };

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

  if (workspacesError) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load workspaces. Please try again later.
      </div>
    );
  }

  // Only show the interface if user is superadmin or admin
  if (!currentUser?.is_superadmin && !currentUser?.is_admin) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        You don't have permission to manage workspace access.
      </div>
    );
  }

  // Extract workspace IDs that already have access
  const existingWorkspaceIds = workspaceAccess?.map(access => access.workspaces?.id) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workspace Access</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Building className="h-4 w-4 mr-2" />
            Add Workspace
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Workspace Access</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <WorkspaceList
                workspaces={workspaces}
                onSelect={handleAddWorkspace}
                existingWorkspaceIds={existingWorkspaceIds}
              />
            </div>
          </DialogContent>
        </Dialog>
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
          {workspaceAccess?.map((access) => (
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
