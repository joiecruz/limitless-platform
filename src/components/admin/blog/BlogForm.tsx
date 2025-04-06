
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BlogFormContent } from "./components/BlogFormContent";
import { BlogFormFooter } from "./components/BlogFormFooter";
import { useBlogFormSubmit } from "./hooks/useBlogFormSubmit";
import { Form } from "@/components/ui/form";

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

export type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Partial<BlogFormValues>;
  onSuccess?: () => void;
  isEdit?: boolean;
  blogId?: string;
}

export function BlogForm({
  initialData,
  onSuccess,
  isEdit,
  blogId
}: BlogFormProps) {
  const { handleSubmit: submitForm, isLoading } = useBlogFormSubmit({
    isEdit,
    blogId,
    onSuccess,
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      meta_description: initialData?.meta_description || "",
      published: initialData?.published || false,
      categories: initialData?.categories || [],
      tags: initialData?.tags || [],
      cover_image: initialData?.cover_image || "",
      created_at: initialData?.created_at || new Date().toISOString(),
      read_time: initialData?.read_time,
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    await submitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BlogFormContent 
          form={form}
          blogId={blogId}
          isEdit={isEdit}
        />
        <BlogFormFooter isLoading={isLoading} />
      </form>
    </Form>
  );
}
