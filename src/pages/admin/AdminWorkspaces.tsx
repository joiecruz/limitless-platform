import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Plus, Trash2 } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/admin/workspaces/CreateWorkspaceDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWorkspaceDelete } from "@/components/admin/workspaces/useWorkspaceDelete";
import { useToast } from "@/hooks/use-toast";

export default function AdminWorkspaces() {
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { handleDeleteWorkspace } = useWorkspaceDelete();
  const { toast } = useToast();

  const { data: workspaces, isLoading, refetch } = useQuery({
    queryKey: ['admin-workspaces', search],
    queryFn: async () => {
      // Get current user profile to check admin status
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not found");
      }

      // Get user profile to check admin status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, is_superadmin')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error("Failed to get user profile");
      }

      if (!profile.is_admin && !profile.is_superadmin) {
        throw new Error("Access denied: Admin privileges required");
      }

      // Direct database access - RLS policies now allow admins to view all workspaces
      const query = supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members (
            count
          )
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database access error:', error);
        throw error;
      }

      // Transform data to match expected format
      return data.map((workspace: any) => ({
        id: workspace.id,
        name: workspace.name || 'Unnamed Workspace',
        slug: workspace.slug || 'unnamed',
        created_at: workspace.created_at,
        updated_at: workspace.updated_at,
        member_count: workspace.workspace_members[0]?.count || 0
      }));
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading workspaces",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const onDeleteWorkspace = async (workspaceId: string) => {
    setIsDeleting(true);
    try {
      const success = await handleDeleteWorkspace(workspaceId);
      if (success) {
        await refetch();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search workspaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workspace
          </Button>
        </div>
      </div>

      {isLoading || isDeleting ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {search ? "No workspaces found matching your search" : "No workspaces found"}
                  </TableCell>
                </TableRow>
              ) : (
                workspaces?.map((workspace: any) => (
                <TableRow key={workspace.id}>
                  <TableCell className="font-medium">{workspace.name}</TableCell>
                    <TableCell>{workspace.member_count || 0}</TableCell>
                  <TableCell>
                    {new Date(workspace.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/workspaces/${workspace.id}`)}
                      >
                        Manage
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the workspace "{workspace.name}"? This action cannot be undone.
                              All workspace data, including channels, messages, and member associations will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteWorkspace(workspace.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateWorkspaceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}