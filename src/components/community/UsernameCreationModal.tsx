import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UsernameCreationModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export function UsernameCreationModal({ open, onClose, userId }: UsernameCreationModalProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);

    try {
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .single();

      if (existingUser) {
        toast({
          title: "Username taken",
          description: "This username is already in use. Please choose another one.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Update user's username
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Mark that user has completed username setup
      localStorage.setItem('username_setup_completed', 'true');

      toast({
        title: "Username created!",
        description: "Your username has been set successfully. You can change it later in your profile settings.",
      });

      onClose();
    } catch (error) {
      console.error('Error creating username:', error);
      toast({
        title: "Error",
        description: "Failed to create username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark that user has seen this modal (but skipped)
    localStorage.setItem('username_setup_completed', 'true');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => isLoading && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">Create Your Username</DialogTitle>
          <DialogDescription className="text-center">
            Welcome to the community! Create a username to get mentioned in conversations and connect with others.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              className="text-center"
            />
            <p className="text-xs text-gray-500 text-center">
              Choose a unique username that others can use to mention you
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="w-full sm:w-auto bg-[#393CA0] hover:bg-[#393CA0]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Username'
              )}
            </Button>
          </DialogFooter>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          You can change your username anytime in your profile settings
        </p>
      </DialogContent>
    </Dialog>
  );
}