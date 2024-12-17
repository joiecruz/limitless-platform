import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InviteMemberDialog } from "@/components/settings/members/InviteMemberDialog";

export default function AdminWorkspaceDetails() {
  const { workspaceId } = useParams();
  const [search, setSearch] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  
  console.log("Fetching workspace details for ID:", workspaceId);

  const { data: workspace, isLoading: isLoadingWorkspace } = useQuery({
    queryKey: ['admin-workspace', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error("No workspace ID provided");
      
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      if (error) {
        console.error("Error fetching workspace:", error);
        throw error;
      }
      
      console.log("Workspace data:", data);
      return data;
    },
    enabled: !!workspaceId,
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['admin-workspace-members', workspaceId, search],
    queryFn: async () => {
      if (!workspaceId) throw new Error("No workspace ID provided");
      
      let query = supabase
        .from('workspace_members')
        .select(`
          *,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email:id (
              email
            )
          )
        `)
        .eq('workspace_id', workspaceId);

      if (search) {
        query = query.or(`profiles.first_name.ilike.%${search}%,profiles.last_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
      
      console.log("Members data:", data);
      return data;
    },
    enabled: !!workspaceId,
  });

  const handleRemoveMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  if (isLoadingWorkspace) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          <p className="text-sm text-gray-500">Workspace Management</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <Button onClick={() => setShowInviteDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {isLoadingMembers ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell>
                    {member.profiles?.first_name} {member.profiles?.last_name}
                  </TableCell>
                  <TableCell>
                    {member.profiles?.email?.email}
                  </TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMember(member.user_id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <InviteMemberDialog
        isOpen={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        workspaceId={workspaceId || ''}
        workspaceName={workspace.name}
      />
    </div>
  );
}