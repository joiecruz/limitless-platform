
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  categories?: string[];
  tags?: string[];
  cover_image?: string;
  created_at?: string;
}

interface UseBlogFormSubmitProps {
  isEdit?: boolean;
  blogId?: string;
  onSuccess?: () => void;
}

export function useBlogFormSubmit({ isEdit, blogId, onSuccess }: UseBlogFormSubmitProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: BlogFormData) => {
    try {
      setIsLoading(true);
      
      // Use excerpt directly without meta_description
      if (isEdit && blogId) {
        const { error } = await supabase
          .from('articles')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', blogId);

        if (error) throw error;

        toast({
          title: "Blog post updated",
          description: "The blog post has been updated successfully.",
        });
      } else {
        // For new posts, ensure we have a creation date
        const createdAt = formData.created_at || new Date().toISOString();
        
        const { error } = await supabase
          .from('articles')
          .insert([{
            ...formData,
            created_at: createdAt,
          }]);

        if (error) throw error;

        toast({
          title: "Blog post created",
          description: "The blog post has been created successfully.",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Blog submission error:", error);
      toast({
        title: `Error ${isEdit ? 'updating' : 'creating'} blog post`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
}
