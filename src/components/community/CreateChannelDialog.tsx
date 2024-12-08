import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateChannelDialogProps {
  onCreateChannel: (name: string, workspaceId: string) => void;
  workspaceId: string;
}

export function CreateChannelDialog({ onCreateChannel, workspaceId }: CreateChannelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const handleCreateChannel = () => {
    if (newChannelName.trim() && workspaceId) {
      onCreateChannel(newChannelName, workspaceId);
      setNewChannelName("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 hover:bg-primary-50 hover:text-primary-600"
          title="Create Private Channel"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Private Channel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Channel name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
          <Button onClick={handleCreateChannel} disabled={!newChannelName.trim() || !workspaceId}>
            Create Channel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}