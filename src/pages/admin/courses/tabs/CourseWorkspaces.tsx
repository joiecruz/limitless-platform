import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService, workspaceService } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { WorkspaceList } from "@/components/workspace/WorkspaceList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Course } from "../types";
import { Workspace, WorkspaceMemberWithWorkspace } from "@/components/workspace/types";

interface CourseWorkspacesProps {
  courseId: string;
}

export function CourseWorkspaces({ courseId }: CourseWorkspacesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentWorkspaces, setCurrentWorkspaces] = useState<Workspace[]>([]);

  // Fetch course details
  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourse(courseId),
    enabled: !!courseId,
  });

  // Fetch workspaces with access to the course
  const { data: workspacesWithAccess, isLoading: isWorkspacesWithAccessLoading } = useQuery({
    queryKey: ['course-workspaces', courseId],
    queryFn: async () => {
      const data = await workspaceService.getUserWorkspaces();
      return (data as WorkspaceMemberWithWorkspace[]).map(wm => wm.workspace);
    },
    enabled: !!courseId,
    onSuccess: (data) => {
      if (data) {
        setCurrentWorkspaces(data);
      }
    },
  });

  // Fetch all workspaces
  const { data: allWorkspaces, isLoading: isAllWorkspacesLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceService.getUserWorkspaces(),
  });

  useEffect(() => {
    if (workspacesWithAccess) {
      setCurrentWorkspaces(workspacesWithAccess);
    }
  }, [workspacesWithAccess]);

  const handleAddWorkspaceAccess = async (workspace: Workspace) => {
    try {
      // Optimistically update the state
      setCurrentWorkspaces(prev => [...prev, workspace]);

      // Call the edge function to add workspace access
      const response = await fetch('/api/add-workspace-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, workspaceId: workspace.id }),
      });

      if (!response.ok) {
        // If the API call fails, revert the state update
        setCurrentWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add workspace access');
      }

      toast({
        title: "Success",
        description: "Workspace access added successfully",
      });
    } catch (error: any) {
      console.error('Error adding workspace access:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add workspace access",
        variant: "destructive",
      });
    }
  };

  const handleRemoveWorkspaceAccess = async (workspace: Workspace) => {
    try {
      // Optimistically update the state
      setCurrentWorkspaces(prev => prev.filter(w => w.id !== workspace.id));

      // Call the edge function to remove workspace access
      const response = await fetch('/api/remove-workspace-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, workspaceId: workspace.id }),
      });

      if (!response.ok) {
        // If the API call fails, revert the state update
        setCurrentWorkspaces(prev => [...prev, workspace]);
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove workspace access');
      }

      toast({
        title: "Success",
        description: "Workspace access removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing workspace access:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove workspace access",
        variant: "destructive",
      });
    }
  };

  if (isCourseLoading || isWorkspacesWithAccessLoading || isAllWorkspacesLoading) {
    return <div>Loading...</div>;
  }

  // Filter out workspaces that already have access
  const availableWorkspaces = (allWorkspaces as WorkspaceMemberWithWorkspace[] || [])
    .map(wm => wm.workspace)
    .filter(workspace => !currentWorkspaces.find(cw => cw.id === workspace.id));

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Workspaces with Access</h2>
        <p className="text-muted-foreground">Manage which workspaces have access to this course.</p>
      </div>

      <div className="mb-4">
        {workspacesWithAccess && workspacesWithAccess.length > 0 ? (
          <Table>
            <TableCaption>Workspaces that have access to this course.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspacesWithAccess.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell>{workspace.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveWorkspaceAccess(workspace)}>
                      Remove Access
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No workspaces have access to this course</p>
        )}
      </div>

      <div>
        <h3 className="text-md font-semibold mb-2">Add Workspace Access</h3>
        <WorkspaceList 
          workspaces={availableWorkspaces || []} 
          onSelect={handleAddWorkspaceAccess} 
          existingWorkspaceIds={currentWorkspaces.map(w => w.id)}
        />
      </div>
    </div>
  );
}
