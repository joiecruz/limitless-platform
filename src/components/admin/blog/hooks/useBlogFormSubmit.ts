
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_description?: string;
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
      
      // Ensure the data we send has meta_description property
      const finalData = {
        ...formData,
        meta_description: formData.excerpt
      };
      
      if (isEdit && blogId) {
        const { error } = await supabase
          .from('articles')
          .update({
            ...finalData,
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
        const createdAt = finalData.created_at || new Date().toISOString();
        
        const { error } = await supabase
          .from('articles')
          .insert([{
            ...finalData,
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
