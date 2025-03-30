
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
  read_time?: number;
}

interface UseBlogFormSubmitProps {
  isEdit?: boolean;
  blogId?: string;
  onSuccess?: () => void;
}

// Helper function to calculate estimated read time
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export function useBlogFormSubmit({ isEdit, blogId, onSuccess }: UseBlogFormSubmitProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: BlogFormData) => {
    try {
      setIsLoading(true);
      
      // Calculate read time if not provided
      const readTime = formData.read_time || calculateReadTime(formData.content);
      
      if (isEdit && blogId) {
        const { error } = await supabase
          .from('articles')
          .update({
            ...formData,
            read_time: readTime,
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
            read_time: readTime,
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
