
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BlogFormFields } from "./components/BlogFormFields";
import { BlogFormActions } from "./components/BlogFormActions";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
}

interface EditBlogDialogProps {
  blogId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditBlogDialog({ blogId, isOpen, onClose, onSuccess }: EditBlogDialogProps) {
  const { toast } = useToast();
  const form = useForm<BlogFormData>();

  const { data: blog, isLoading: isFetching } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId) return null;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!blogId,
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || "",
        cover_image: blog.cover_image || "",
      });
    }
  }, [blog, form]);

  const onSubmit = async (data: BlogFormData) => {
    if (!blogId) return;

    try {
      const { error } = await supabase
        .from('articles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', blogId);

      if (error) throw error;

      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully.",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <BlogFormFields form={form} blogId={blogId} />
              <BlogFormActions onClose={onClose} />
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
