import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useInviteSubmit } from "./hooks/useInviteSubmit";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InviteModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteModal({ open = false, onOpenChange }: InviteModalProps) {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace");
  const email = searchParams.get("email");
  const { handleSubmit, isLoading } = useInviteSubmit(workspaceId, email);

  return (
    <Dialog open={open} onOpenChange={(value) => {
      // Prevent closing the modal
      if (!value) return;
      if (onOpenChange) onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[600px] h-[400px] p-0 [&>button]:hidden">
        <div className="p-6 h-full flex flex-col">
          <DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2 text-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome to Your New Workspace</h1>
                <p className="text-muted-foreground">Click below to confirm your email and join the workspace</p>
              </div>
              <div className="flex justify-center">
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full max-w-sm"
                >
                  {isLoading ? "Processing..." : "Confirm Email & Join"}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}