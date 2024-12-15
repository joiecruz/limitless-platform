import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PendingJoin {
  workspaceId: string;
  role: string;
  invitationId: string;
}

export function useWorkspaceJoin() {
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const joinWorkspace = async (session: any) => {
    if (!session?.user?.id) {
      console.error("No user ID found in session");
      return;
    }

    setIsJoining(true);
    try {
      const pendingJoinStr = localStorage.getItem('pendingWorkspaceJoin');
      if (!pendingJoinStr) {
        console.log('No pending workspace join, redirecting to onboarding');
        navigate('/onboarding');
        return;
      }

      const pendingJoin: PendingJoin = JSON.parse(pendingJoinStr);
      console.log('Processing pending workspace join:', pendingJoin);

      // First check if already a member
      const { data: existingMember } = await supabase
        .from("workspace_members")
        .select()
        .eq('workspace_id', pendingJoin.workspaceId)
        .eq('user_id', session.user.id)
        .single();

      if (existingMember) {
        console.log('User is already a member of this workspace');
        localStorage.removeItem('pendingWorkspaceJoin');
        toast({
          title: "Welcome back!",
          description: "You're already a member of this workspace.",
        });
        navigate(`/dashboard?workspace=${pendingJoin.workspaceId}`);
        return;
      }

      // Add user to workspace
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: pendingJoin.workspaceId,
          user_id: session.user.id,
          role: pendingJoin.role
        });

      if (memberError) {
        throw memberError;
      }

      // Update invitation status
      await supabase
        .from("workspace_invitations")
        .update({ status: "accepted" })
        .eq("id", pendingJoin.invitationId);

      localStorage.removeItem('pendingWorkspaceJoin');
      
      toast({
        title: "Welcome!",
        description: "You have successfully joined the workspace.",
      });
      
      navigate(`/dashboard?workspace=${pendingJoin.workspaceId}`);

    } catch (error: any) {
      console.error('Error joining workspace:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join workspace",
        variant: "destructive",
      });
      navigate('/signin');
    } finally {
      setIsJoining(false);
    }
  };

  return { joinWorkspace, isJoining };
}