import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { InviteStep1 } from "./steps/InviteStep1";
import { useInviteSubmit } from "./hooks/useInviteSubmit";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface InviteModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteModal({ open = false, onOpenChange }: InviteModalProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    password: "",
  });

  const { handleSubmit, isLoading } = useInviteSubmit(token);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleNext = async (stepData: { password: string }) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    await handleSubmit({
      password: updatedData.password,
    });
    setShowConfirmation(true);
  };

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
              {!showConfirmation ? (
                <>
                  <div className="space-y-2 text-center mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Set Your Password</h1>
                    <p className="text-muted-foreground">Create a password to access your workspace</p>
                  </div>
                  <InviteStep1 
                    onNext={handleNext}
                    data={formData}
                    loading={isLoading}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-6 text-center h-[400px] animate-fade-in">
                  <div className="rounded-full bg-primary-50 p-3">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Almost there!</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Please check your email to confirm your account and access the workspace dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}