
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
        .insert([{
          name: data.name || '',
          type: data.type || '',
          category: data.category || 'Innovation Process and Tools',
          brief_description: data.brief_description,
          long_description: data.long_description,
          price: data.price,
          cover_image: data.cover_image,
          download_url: data.download_url,
          use_case_1: data.use_case_1,
          use_case_2: data.use_case_2,
          use_case_3: data.use_case_3,
          how_to_use: data.how_to_use,
          when_to_use: data.when_to_use,
        }]);

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
