
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitItemForm } from "./ToolkitItemForm";

interface CreateToolkitItemDialogProps {
  toolkitId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateToolkitItemDialog({ toolkitId, open, onOpenChange }: CreateToolkitItemDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("toolkit_items")
        .insert([{ ...data, toolkit_id: toolkitId }]);

      if (error) throw error;

      toast({
        title: "Item created",
        description: "The toolkit item has been successfully created.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["toolkit-items", toolkitId] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error creating item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Toolkit Item</DialogTitle>
        </DialogHeader>
        <ToolkitItemForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
