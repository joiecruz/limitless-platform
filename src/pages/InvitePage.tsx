import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        const workspaceId = searchParams.get("workspace");
        const email = searchParams.get("email");
        const role = searchParams.get("role");

        if (!workspaceId || !email || !role) {
          throw new Error("Invalid invitation link");
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          // If not logged in, redirect to sign in page with return URL
          const returnUrl = `/invite?${searchParams.toString()}`;
          navigate(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        // Verify user email matches invitation
        if (user.email !== email) {
          throw new Error("Please sign in with the email address that received the invitation");
        }

        // Check if already a member
        const { data: existingMember } = await supabase
          .from('workspace_members')
          .select('*')
          .eq('workspace_id', workspaceId)
          .eq('user_id', user.id)
          .single();

        if (existingMember) {
          toast({
            title: "Already a member",
            description: "You are already a member of this workspace",
          });
          navigate('/dashboard');
          return;
        }

        // Add user to workspace
        const { error: memberError } = await supabase
          .from('workspace_members')
          .insert({
            workspace_id: workspaceId,
            user_id: user.id,
            role: role
          });

        if (memberError) throw memberError;

        toast({
          title: "Welcome!",
          description: "You have successfully joined the workspace",
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Error accepting invitation:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to accept invitation",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsProcessing(false);
      }
    };

    handleInvitation();
  }, [searchParams, navigate, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Processing Invitation</h2>
          <p className="text-muted-foreground">Please wait while we set up your access...</p>
        </div>
      </div>
    );
  }

  return null;
}