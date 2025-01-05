import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useBlogOperations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    } catch (error: any) {
      toast({
        title: "Error deleting blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Blog post ${currentStatus ? 'unpublished' : 'published'}`,
        description: `The blog post has been ${currentStatus ? 'unpublished' : 'published'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    } catch (error: any) {
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    handleDelete,
    togglePublish,
  };
}