import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/types/tool";
import { ToolForm } from "./ToolForm";
import { Loader2 } from "lucide-react";

interface EditToolDialogProps {
  toolId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditToolDialog({ toolId, open, onOpenChange }: EditToolDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tool, isLoading } = useQuery({
    queryKey: ["admin-tool", toolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_tools")
        .select("*")
        .eq("id", toolId)
        .single();

      if (error) throw error;
      return data as Tool;
    },
  });

  const handleSubmit = async (data: Partial<Tool>) => {
    try {
      const { error } = await supabase
        .from("innovation_tools")
        .update(data)
        .eq("id", toolId);

      if (error) throw error;

      toast({
        title: "Tool updated",
        description: "The tool has been successfully updated.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error updating tool",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tool</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ToolForm onSubmit={handleSubmit} defaultValues={tool} />
        )}
      </DialogContent>
    </Dialog>
  );
}