import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface GrantAccessDialogProps {
  courseId: string;
  onAccessGranted: () => void;
}

const GrantAccessDialog = ({ courseId, onAccessGranted }: GrantAccessDialogProps) => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGrantAccess = async () => {
    try {
      setIsLoading(true);

      // First, get the user's profile ID using their email
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      if (profileError || !profiles) {
        throw new Error("User not found");
      }

      // Grant access by inserting into user_course_access
      const { error: accessError } = await supabase
        .from("user_course_access")
        .insert({
          user_id: profiles.id,
          course_id: courseId,
        });

      if (accessError) throw accessError;

      toast({
        title: "Access granted",
        description: `Successfully granted access to ${email}`,
      });

      setIsOpen(false);
      setEmail("");
      onAccessGranted();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to grant access",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant Course Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGrantAccess}
              disabled={!email || isLoading}
            >
              {isLoading ? "Granting access..." : "Grant Access"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrantAccessDialog;