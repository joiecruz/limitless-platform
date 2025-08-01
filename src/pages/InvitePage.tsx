import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InviteModal } from "@/components/invite/InviteModal";
import { verifyInvitation } from "@/components/invite/services/invitationService";
import { LoadingPage } from "@/components/common/LoadingPage";

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          
          throw new Error("Invalid invitation link");
        }

        

        // Verify the invitation first using our service that bypasses RLS
        const { invitation } = await verifyInvitation(token);

        if (!invitation) {
          
          throw new Error("Invalid or expired invitation link");
        }

        // Check if user has a session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          

          // If the signed-in user's email matches the invitation email
          if (session.user.email?.toLowerCase() === invitation.email.toLowerCase()) {
            try {
              // Use the edge function to accept the invitation and add user to workspace
              const { data, error } = await supabase.functions.invoke('process-invitation-acceptance', {
                body: {
                  invitation_id: invitation.id,
                  user_id: session.user.id,
                  workspace_id: invitation.workspace_id,
                  role: invitation.role
                }
              });

              if (error) {
                if (error.message?.includes('already a member')) {
                  
                  localStorage.setItem('selectedWorkspace', invitation.workspace_id);
                  navigate("/dashboard", {
                    replace: true,
                    state: {
                      showOnboarding: false,
                      workspace: invitation.workspace_id,
                      isInvited: true
                    }
                  });
                  return;
                }
                throw new Error(error.message || "Failed to process invitation");
              }

              localStorage.setItem('selectedWorkspace', invitation.workspace_id);
              toast({
                title: "Welcome!",
                description: "You have successfully joined the workspace.",
              });
              navigate("/dashboard", {
                replace: true,
                state: {
                  showOnboarding: false,
                  workspace: invitation.workspace_id,
                  isInvited: true
                }
              });
            } catch (error: any) {
              
              throw new Error("Failed to join workspace. Please try again.");
            }
          } else {
            // If emails don't match, sign out current user
            await supabase.auth.signOut();
            setShowInviteModal(true);
          }
        } else {
          setShowInviteModal(true);
        }
      } catch (error: any) {
        
        toast({
          title: "Error",
          description: error.message || "Failed to process invitation",
          variant: "destructive",
        });
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    handleInvitation();
  }, [searchParams, navigate, toast]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div>
      {showInviteModal && (
        <InviteModal
          open={true}
          onOpenChange={setShowInviteModal}
        />
      )}
    </div>
  );
}
