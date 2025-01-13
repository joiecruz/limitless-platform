import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { InviteStep1 } from "./steps/InviteStep1";
import { useInviteSubmit } from "./hooks/useInviteSubmit";
import { InvitedUserOnboardingModal } from "./InvitedUserOnboardingModal";
import { verifyInvitation } from "./services/invitationService";
import { useToast } from "@/hooks/use-toast";

interface InviteModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteModal({ open = false, onOpenChange }: InviteModalProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string>();

  const [formData, setFormData] = useState({
    password: "",
  });

  const { handleSubmit: submitInvite, isLoading } = useInviteSubmit(token);

  const handleNext = async (stepData: { password: string }) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    try {
      if (!token) {
        throw new Error("No invitation token provided");
      }

      // Verify invitation first to get workspace ID and email
      const { invitation } = await verifyInvitation(token);
      console.log("Verified invitation:", invitation);
      
      if (!invitation) {
        throw new Error("Invalid invitation");
      }

      setWorkspaceId(invitation.workspace_id);

      // Submit the invite with the verified invitation data
      await submitInvite({
        password: updatedData.password,
        email: invitation.email, // Pass the email from the invitation
      });
      
      setShowOnboarding(true);
    } catch (error: any) {
      console.error("Error during invite process:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process invitation",
        variant: "destructive",
      });
    }
  };

  if (showOnboarding) {
    return (
      <InvitedUserOnboardingModal 
        open={true} 
        onOpenChange={() => {
          navigate("/dashboard");
        }}
        workspaceId={workspaceId}
      />
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
                <h1 className="text-2xl font-semibold tracking-tight">Set Your Password</h1>
                <p className="text-muted-foreground">Create a password to access your workspace</p>
              </div>
              <InviteStep1 
                onNext={handleNext}
                data={formData}
                loading={isLoading}
              />
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}