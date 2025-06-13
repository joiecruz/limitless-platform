
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CourseWorkspacesProps {
  courseId: string;
}

interface WorkspaceAccess {
  id: string;
  workspace_id: string;
  course_id: string;
  created_at: string;
  workspaces: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

const CourseWorkspaces = ({ courseId }: CourseWorkspacesProps) => {
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch workspaces with access to this course
  const { data: workspacesWithAccess = [], isLoading: accessLoading } = useQuery({
    queryKey: ["course-workspace-access", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_course_access")
        .select(`
          *,
          workspaces!inner (
            id,
            name,
            slug
          )
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching workspace access:", error);
        throw error;
      }

      return data as WorkspaceAccess[];
    },
  });

  // Fetch all workspaces for granting access
  const { data: allWorkspaces = [], isLoading: workspacesLoading } = useQuery({
    queryKey: ["all-workspaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name, slug")
        .order("name");

      if (error) {
        console.error("Error fetching workspaces:", error);
        throw error;
      }

      return data as Workspace[];
    },
  });

  // Get member count for each workspace
  const { data: memberCounts = {} } = useQuery({
    queryKey: ["workspace-member-counts", workspacesWithAccess.map(w => w.workspace_id)],
    queryFn: async () => {
      if (workspacesWithAccess.length === 0) return {};

      const counts: Record<string, number> = {};
      
      for (const workspace of workspacesWithAccess) {
        const { count, error } = await supabase
          .from("workspace_members")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", workspace.workspace_id);

        if (error) {
          console.error(`Error fetching member count for workspace ${workspace.workspace_id}:`, error);
          counts[workspace.workspace_id] = 0;
        } else {
          counts[workspace.workspace_id] = count || 0;
        }
      }

      return counts;
    },
    enabled: workspacesWithAccess.length > 0,
  });

  const handleGrantAccess = async () => {
    if (!selectedWorkspaceId) {
      toast({
        title: "Error",
        description: "Please select a workspace",
        variant: "destructive",
      });
      return;
    }

    setIsGrantingAccess(true);
    try {
      const { error } = await supabase
        .from("workspace_course_access")
        .insert({
          workspace_id: selectedWorkspaceId,
          course_id: courseId,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "This workspace already has access to the course",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success",
          description: "Access granted successfully",
        });
        
        queryClient.invalidateQueries({ queryKey: ["course-workspace-access", courseId] });
        setIsGrantDialogOpen(false);
        setSelectedWorkspaceId("");
      }
    } catch (error: any) {
      console.error("Error granting access:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to grant access",
        variant: "destructive",
      });
    } finally {
      setIsGrantingAccess(false);
    }
  };

  const handleRevokeAccess = async (accessId: string, workspaceName: string) => {
    try {
      const { error } = await supabase
        .from("workspace_course_access")
        .delete()
        .eq("id", accessId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Access revoked for ${workspaceName}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["course-workspace-access", courseId] });
    } catch (error: any) {
      console.error("Error revoking access:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  // Filter workspaces that don't already have access
  const availableWorkspaces = allWorkspaces.filter(
    workspace => !workspacesWithAccess.some(access => access.workspace_id === workspace.id)
  );

  if (accessLoading || workspacesLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Workspace Access</CardTitle>
          <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Grant Access
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grant Workspace Access</DialogTitle>
                <DialogDescription>
                  Select a workspace to grant access to this course. All members of the workspace will be able to access the course.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workspace-select">Select Workspace</Label>
                  <select
                    id="workspace-select"
                    className="w-full mt-1 p-2 border rounded-md"
                    value={selectedWorkspaceId}
                    onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                  >
                    <option value="">Select a workspace...</option>
                    {availableWorkspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsGrantDialogOpen(false)}
                  disabled={isGrantingAccess}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGrantAccess}
                  disabled={isGrantingAccess || !selectedWorkspaceId}
                >
                  {isGrantingAccess ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Granting...
                    </>
                  ) : (
                    "Grant Access"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{workspacesWithAccess.length}</div>
          <p className="text-sm text-muted-foreground">
            workspaces with access to this course
          </p>
        </CardContent>
      </Card>

      {/* Workspaces Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workspaces with Access</CardTitle>
        </CardHeader>
        <CardContent>
          {workspacesWithAccess.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Access Granted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspacesWithAccess.map((access) => (
                  <TableRow key={access.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{access.workspaces.name}</p>
                        <p className="text-sm text-muted-foreground">/{access.workspaces.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {memberCounts[access.workspace_id] || 0} members
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(access.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeAccess(access.id, access.workspaces.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No workspaces have access to this course yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseWorkspaces;
