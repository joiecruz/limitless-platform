import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { InviteStep1 } from "./steps/InviteStep1";
import { InviteSignIn } from "./steps/InviteSignIn";
import { useInviteSubmit } from "./hooks/useInviteSubmit";
import { verifyInvitation } from "./services/invitationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteModal({ open = false, onOpenChange }: InviteModalProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
  });
  const [invitation, setInvitation] = useState<any>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const { handleSubmit: submitInvite, isLoading } = useInviteSubmit(token);

  useEffect(() => {
    const checkUserExists = async () => {
      if (!token) return;

      try {
        // Verify invitation and get user existence info
        const { invitation: inviteData } = await verifyInvitation(token);
        if (!inviteData) {
          throw new Error("Invalid invitation");
        }
        setInvitation(inviteData);

        // Use the userExists property from the invitation response
        setUserExists(inviteData.userExists || false);
      } catch (error) {
        console.error("Error checking user existence:", error);
        setUserExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserExists();
  }, [token]);

  const handleSignIn = async (password: string) => {
    if (!invitation) return;

    try {
      // Sign in the existing user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: invitation.email,
        password: password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Use the edge function to accept the invitation and add user to workspace
        const { error: acceptError } = await supabase.functions.invoke('process-invitation-acceptance', {
          body: {
            invitation_id: invitation.id,
            user_id: data.user.id,
            workspace_id: invitation.workspace_id,
            role: invitation.role
          }
        });

        if (acceptError && !acceptError.message?.includes('already a member')) {
          throw new Error(acceptError.message || "Failed to join workspace");
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
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    }
  };

  const handleNext = async (stepData: { password: string }) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    try {
      if (!token || !invitation) {
        throw new Error("No invitation token provided");
      }

      // Submit the invite with the verified invitation data
      await submitInvite({
        password: updatedData.password,
        email: invitation.email,
      });

      // Redirect to sign in page with success message
      toast({
        title: "Account Created",
        description: "Your account has been created. Please sign in with your email and password.",
      });
      navigate("/signin");

    } catch (error: any) {
      console.error("Error during invite process:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process invitation",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={(value) => {
        if (!value) return;
        if (onOpenChange) onOpenChange(value);
      }}>
        <DialogContent className="sm:max-w-[600px] h-[600px] p-0 [&>button]:hidden">
          <div className="p-6 h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Loading...</h2>
              <p className="text-muted-foreground">Verifying invitation</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      // Prevent closing the modal
      if (!value) return;
      if (onOpenChange) onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[600px] h-[600px] p-0 [&>button]:hidden">
        <div className="p-6 h-full flex flex-col">
          <DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2 text-center mb-6">
                {userExists ? (
                  <>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome Back!</h1>
                    <p className="text-muted-foreground">Sign in to join the workspace</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold tracking-tight">Set Your Password</h1>
                    <p className="text-muted-foreground">Create a password to access your workspace</p>
                  </>
                )}
              </div>
              {userExists ? (
                <InviteSignIn
                  onSignIn={handleSignIn}
                  email={invitation?.email}
                  loading={isLoading}
                />
              ) : (
                <InviteStep1
                  onNext={handleNext}
                  data={formData}
                  loading={isLoading}
                />
              )}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}