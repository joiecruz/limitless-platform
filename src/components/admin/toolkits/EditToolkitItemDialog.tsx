
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitItemForm } from "./ToolkitItemForm";
import { Loader2 } from "lucide-react";

interface EditToolkitItemDialogProps {
  itemId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditToolkitItemDialog({ itemId, open, onOpenChange }: EditToolkitItemDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: item, isLoading } = useQuery({
    queryKey: ["toolkit-item", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!itemId,
  });

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("toolkit_items")
        .update(data)
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Item updated",
        description: "The toolkit item has been successfully updated.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["toolkit-items"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Toolkit Item</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ToolkitItemForm onSubmit={handleSubmit} defaultValues={item} />
        )}
      </DialogContent>
    </Dialog>
  );
}
