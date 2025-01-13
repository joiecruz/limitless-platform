import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { BatchEmailInput } from "./BatchEmailInput";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceName: string;
}

export function InviteMemberDialog({ 
  isOpen, 
  onOpenChange, 
  workspaceId, 
  workspaceName 
}: InviteMemberDialogProps) {
  const [selectedRole, setSelectedRole] = useState("member");
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInvite = async (emails: string[]) => {
    if (!workspaceId) return;

    setIsInviting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userData.user.id)
        .single();

      const inviterName = profileData?.first_name && profileData?.last_name
        ? `${profileData.first_name} ${profileData.last_name}`
        : 'A team member';

      console.log("Sending invite with data:", {
        emails,
        workspaceId,
        workspaceName,
        inviterName,
        role: selectedRole,
        inviterId: userData.user.id,
      });

      const { data, error } = await supabase.functions.invoke('send-workspace-invite', {
        body: {
          emails,
          workspaceId,
          workspaceName,
          inviterName,
          role: selectedRole,
          inviterId: userData.user.id,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || "Failed to send invitations");
      }

      if (!data?.success) {
        console.error('Invitation response error:', data);
        throw new Error(data?.error || "Failed to process invitations");
      }

      toast({
        title: "Invitations Processed",
        description: data.message || `Invitations have been sent to ${data.invitedCount} email${data.invitedCount === 1 ? '' : 's'}`,
      });
      
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId]
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending invites:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <BatchEmailInput onSubmit={handleInvite} isLoading={isInviting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}