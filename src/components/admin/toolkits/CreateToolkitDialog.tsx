
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitForm } from "./ToolkitForm";

interface CreateToolkitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateToolkitDialog({ open, onOpenChange }: CreateToolkitDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("toolkits")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Toolkit created",
        description: "The toolkit has been successfully created.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-toolkits"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error creating toolkit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Toolkit</DialogTitle>
        </DialogHeader>
        <ToolkitForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
