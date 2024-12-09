import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        const workspaceId = searchParams.get("workspace");
        const email = searchParams.get("email");
        const role = searchParams.get("role");

        console.log("Handling invitation with params:", { workspaceId, email, role });

        if (!workspaceId || !email || !role) {
          throw new Error("Invalid invitation link");
        }

        // Check if user is already signed in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // If the signed-in user's email matches the invitation email
          if (session.user.email === decodeURIComponent(email)) {
            // Add user to workspace
            const { error: memberError } = await supabase
              .from("workspace_members")
              .insert({
                workspace_id: workspaceId,
                user_id: session.user.id,
                role: role
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

            toast({
              title: "Welcome!",
              description: "You have successfully joined the workspace.",
            });
            navigate("/dashboard");
          } else {
            // If emails don't match, sign out current user
            await supabase.auth.signOut();
            setShowOnboarding(true);
          }
        } else {
          setShowOnboarding(true);
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
    return null;
  }

  return showOnboarding ? <OnboardingModal isInvitedUser={true} /> : null;
}