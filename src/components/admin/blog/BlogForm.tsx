import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./RichTextEditor";
import { BlogTitleInput } from "./components/BlogTitleInput";
import { BlogSlugInput } from "./components/BlogSlugInput";
import { BlogExcerptInput } from "./components/BlogExcerptInput";
import { BlogMetaDescription } from "./components/BlogMetaDescription";
import { BlogPublishToggle } from "./components/BlogPublishToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    meta_description?: string;
    published?: boolean;
  };
  onSubmit?: (data: any) => void;
  onSuccess?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  blogId?: string;
}

export function BlogForm({ 
  initialData, 
  onSubmit, 
  onSuccess, 
  isLoading,
  isEdit,
  blogId 
}: BlogFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    meta_description: initialData?.meta_description || "",
    published: initialData?.published || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.slug) newErrors.slug = "Slug is required";
    if (!formData.content) newErrors.content = "Content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
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
          const { error } = await supabase
            .from('articles')
            .insert([{
              ...formData,
              published: false,
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
      }
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BlogTitleInput
        value={formData.title}
        onChange={(value) => updateFormData("title", value)}
        error={errors.title}
      />

      <BlogSlugInput
        value={formData.slug}
        onChange={(value) => updateFormData("slug", value)}
        error={errors.slug}
      />

      <div className="space-y-2">
        <RichTextEditor
          value={formData.content}
          onChange={(value) => updateFormData("content", value)}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <BlogExcerptInput
        value={formData.excerpt}
        onChange={(value) => updateFormData("excerpt", value)}
        error={errors.excerpt}
      />

      <BlogMetaDescription
        value={formData.meta_description}
        onChange={(value) => updateFormData("meta_description", value)}
        error={errors.meta_description}
      />

      <BlogPublishToggle
        value={formData.published}
        onChange={(value) => updateFormData("published", value)}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}