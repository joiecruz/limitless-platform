import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InviteModal } from "@/components/invite/InviteModal";

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

        // Add the token to the request headers for RLS policy
        const { data: invitation, error } = await supabase
          .from("workspace_invitations")
          .select("*")
          .single()
          .headers({
            'x-invite-token': token
          });

        if (error || !invitation) {
          console.error("Error fetching invitation:", error);
          throw new Error("Invalid or expired invitation");
        }

        console.log("Valid invitation found:", invitation);

        // Check if user has a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User has existing session:", session.user.email);
          
          // If the signed-in user's email matches the invitation email
          if (session.user.email?.toLowerCase() === invitation.email.toLowerCase()) {
            // Add user to workspace
            const { error: memberError } = await supabase
              .from("workspace_members")
              .insert({
                workspace_id: invitation.workspace_id,
                user_id: session.user.id,
                role: invitation.role
              });

            if (memberError) {
              if (memberError.code === '23505') { // Unique violation
                toast({
                  title: "Already a member",
                  description: "You are already a member of this workspace.",
                });
                navigate("/dashboard");
                return;
              }
              throw memberError;
            }

            // Update invitation status
            await supabase
              .from("workspace_invitations")
              .update({ status: "accepted" })
              .eq("id", invitation.id)
              .headers({
                'x-invite-token': token
              });

            toast({
              title: "Welcome!",
              description: "You have successfully joined the workspace.",
            });
            navigate("/dashboard");
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