import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InviteMemberDialog } from "@/components/settings/members/InviteMemberDialog";
import { WorkspaceHeader } from "@/components/admin/workspaces/WorkspaceHeader";
import { MembersTable } from "@/components/admin/workspaces/MembersTable";
import { Workspace, WorkspaceMember } from "@/components/admin/workspaces/types";

export default function AdminWorkspaceDetails() {
  const { id: workspaceId } = useParams();
  const [search, setSearch] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();
  
  // Fetch workspace details
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
      
      return data as Workspace;
    },
    enabled: !!workspaceId,
  });

  // Fetch workspace members with their profile information
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['admin-workspace-members', workspaceId, search],
    queryFn: async () => {
      if (!workspaceId) throw new Error("No workspace ID provided");
      
      console.log("Fetching members for workspace:", workspaceId);
      
      let query = supabase
        .from('workspace_members')
        .select(`
          user_id,
          role,
          created_at,
          profiles (
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

      console.log("Fetched members data:", data);
      
      return data as WorkspaceMember[];
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
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <p className="text-lg text-gray-600">Workspace not found or you don't have access to it.</p>
        <p className="text-sm text-gray-500">Please check the URL and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkspaceHeader
        workspaceName={workspace.name}
        search={search}
        onSearchChange={setSearch}
        onInviteClick={() => setShowInviteDialog(true)}
      />

      {isLoadingMembers ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !members?.length ? (
        <div className="flex items-center justify-center h-[200px] border rounded-lg">
          <p className="text-gray-500">No members found</p>
        </div>
      ) : (
        <MembersTable
          members={members}
          onRemoveMember={handleRemoveMember}
        />
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