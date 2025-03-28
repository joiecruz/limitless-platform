import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InviteModal } from "@/components/invite/InviteModal";
import { verifyInvitation } from "@/components/invite/services/invitationService";

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
          console.error("No token found in URL");
          throw new Error("Invalid invitation link");
        }

        console.log("Handling invitation with token:", token);
        
        // Verify the invitation first
        const { invitation } = await verifyInvitation(token);

        if (!invitation) {
          console.error("No invitation found for token:", token);
          throw new Error("Invalid or expired invitation link");
        }

        // Check if user has a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User has existing session:", session.user.email);
          
          // If the signed-in user's email matches the invitation email
          if (session.user.email?.toLowerCase() === invitation.email.toLowerCase()) {
            try {
              // Add user to workspace
              const { error: memberError } = await supabase
                .from("workspace_members")
                .insert({
                  workspace_id: invitation.workspace_id,
                  user_id: session.user.id,
                  role: invitation.role
                })
                .select()
                .single();

              if (memberError) {
                if (memberError.code === '23505') { // Unique violation
                  console.log("User is already a member of this workspace");
                  localStorage.setItem('selectedWorkspace', invitation.workspace_id);
                  navigate("/dashboard", { 
                    replace: true,
                    state: { 
                      showOnboarding: false,
                      workspace: invitation.workspace_id
                    }
                  });
                  return;
                }
                throw memberError;
              }

              // Update invitation status
              const { error: updateError } = await supabase
                .from("workspace_invitations")
                .update({ 
                  status: "accepted",
                  accepted_at: new Date().toISOString()
                })
                .eq("id", invitation.id);

              if (updateError) {
                console.error("Error updating invitation status:", updateError);
                throw updateError;
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
                  workspace: invitation.workspace_id
                }
              });
            } catch (error: any) {
              console.error("Error processing workspace join:", error);
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
        console.error("Error handling invitation:", error);
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
    return null; // Or a loading spinner
  }

  return (
    <div>
      {showInviteModal && (
        <InviteModal
          open={true}
          onOpenChange={() => {}}
        />
      )}
    </div>
  );
}