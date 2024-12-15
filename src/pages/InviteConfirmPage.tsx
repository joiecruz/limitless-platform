import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";

export default function InviteConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmInvitation = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          throw new Error("Invalid confirmation link");
        }

        // Get the invitation details
        const { data: invitation, error: inviteError } = await supabase
          .from("workspace_invitations")
          .select("*")
          .eq("magic_link_token", token)
          .eq("status", "pending")
          .single();

        if (inviteError || !invitation) {
          throw new Error("Invalid or expired invitation");
        }

        // Check if user has a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // If the signed-in user's email matches the invitation email
          if (session.user.email === invitation.email) {
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
              .update({ 
                status: "accepted",
                accepted_at: new Date().toISOString()
              })
              .eq("id", invitation.id);

            toast({
              title: "Welcome!",
              description: "You have successfully joined the workspace.",
            });
            navigate("/dashboard");
          } else {
            // If emails don't match, sign out current user
            await supabase.auth.signOut();
            navigate(`/signin?redirect=/invite/confirm?token=${token}`);
          }
        } else {
          // No session, redirect to sign in
          navigate(`/signin?redirect=/invite/confirm?token=${token}`);
        }
      } catch (error: any) {
        console.error("Error confirming invitation:", error);
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

    confirmInvitation();
  }, [searchParams, navigate, toast]);

  if (loading) {
    return <LoadingQuotes />;
  }

  return null;
}