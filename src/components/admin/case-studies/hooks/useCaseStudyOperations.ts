import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useCaseStudyOperations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this case study?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Case study deleted",
        description: "The case study has been deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
    } catch (error: any) {
      toast({
        title: "Error deleting case study",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleDelete };
}