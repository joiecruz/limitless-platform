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
      // Check URL parameters first for workspace context
      const urlParams = new URLSearchParams(window.location.search);
      const workspaceFromUrl = urlParams.get('workspace');
      
      // Then check localStorage as fallback
      const pendingJoinStr = localStorage.getItem('pendingWorkspaceJoin');
      let pendingJoin: PendingJoin | null = null;
      
      if (pendingJoinStr) {
        pendingJoin = JSON.parse(pendingJoinStr);
      }

      const workspaceId = workspaceFromUrl || (pendingJoin?.workspaceId);
      
      if (!workspaceId) {
        console.log('No workspace context found, redirecting to onboarding');
        navigate('/onboarding', { state: { isInvited: false } });
        return;
      }

      console.log('Processing workspace join:', { workspaceId, pendingJoin });

      // First check if already a member
      const { data: existingMember } = await supabase
        .from("workspace_members")
        .select()
        .eq('workspace_id', workspaceId)
        .eq('user_id', session.user.id)
        .single();

      if (existingMember) {
        console.log('User is already a member of this workspace');
        localStorage.removeItem('pendingWorkspaceJoin');
        toast({
          title: "Welcome back!",
          description: "You're already a member of this workspace.",
        });
        navigate(`/dashboard?workspace=${workspaceId}`);
        return;
      }

      // If we have pending join data, use it to add the user to the workspace
      if (pendingJoin) {
        // Add user to workspace
        const { error: memberError } = await supabase
          .from("workspace_members")
          .insert({
            workspace_id: workspaceId,
            user_id: session.user.id,
            role: pendingJoin.role
          });

        if (memberError) {
          throw memberError;
        }

        localStorage.removeItem('pendingWorkspaceJoin');
        
        // Redirect to onboarding with invited user context
        navigate('/onboarding', { 
          state: { 
            isInvited: true
          }
        });
      }
      
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