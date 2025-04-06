
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Plus } from "lucide-react";
import { BlogFormContent } from "./components/BlogFormContent";
import { useBlogFormSubmit } from "./hooks/useBlogFormSubmit";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogFormValues } from "./BlogForm";

interface CreateBlogDialogProps {
  onSuccess: () => void;
}

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  meta_description: z.string().optional(),
  cover_image: z.string().optional(),
  published: z.boolean().default(false),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  created_at: z.string().default(new Date().toISOString()),
  read_time: z.number().optional(),
});

export function CreateBlogDialog({ onSuccess }: CreateBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const { handleSubmit: submitToServer, isLoading } = useBlogFormSubmit({ 
    onSuccess: () => {
      setOpen(false);
      onSuccess();
    }
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      meta_description: "",
      cover_image: "",
      published: false,
      categories: [],
      tags: [],
      created_at: new Date().toISOString(),
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    await submitToServer(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Blog Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BlogFormContent 
              form={form}
              blogId={null}
              isEdit={false}
            />
            <div className="flex justify-end mt-6 space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
