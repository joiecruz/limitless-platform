import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { ToolForm } from "./ToolForm";

interface CreateToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateToolDialog({ open, onOpenChange }: CreateToolDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: Partial<Tool>) => {
    try {
      const { error } = await supabase
        .from("innovation_tools")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Tool created",
        description: "The tool has been successfully created.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error creating tool",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Tool</DialogTitle>
        </DialogHeader>
        <ToolForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}