import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CreateChannelDialogProps {
  onCreateChannel: (name: string, workspaceId: string) => void;
  workspaceId: string;
  comingSoon?: boolean;
}

export function CreateChannelDialog({ onCreateChannel, workspaceId, comingSoon }: CreateChannelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    if (comingSoon) {
      toast({
        title: "Coming Soon",
        description: "Private channels feature is coming soon!",
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 hover:bg-primary-50 hover:text-primary-600"
        title="Create Private Channel"
        onClick={handleClick}
      >
        <Plus className="h-4 w-4" />
      </Button>
      {!comingSoon && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Private Channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p>Private channels feature is coming soon!</p>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}