
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitForm } from "./ToolkitForm";
import { Loader2 } from "lucide-react";

interface EditToolkitDialogProps {
  toolkitId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditToolkitDialog({ toolkitId, open, onOpenChange }: EditToolkitDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: toolkit, isLoading } = useQuery({
    queryKey: ["admin-toolkit", toolkitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkits")
        .select("*")
        .eq("id", toolkitId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!toolkitId,
  });

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("toolkits")
        .update(data)
        .eq("id", toolkitId);

      if (error) throw error;

      toast({
        title: "Toolkit updated",
        description: "The toolkit has been successfully updated.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-toolkits"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error updating toolkit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Toolkit</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ToolkitForm onSubmit={handleSubmit} defaultValues={toolkit} />
        )}
      </DialogContent>
    </Dialog>
  );
}
