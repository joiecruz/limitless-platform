import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./RichTextEditor";
import { BlogTitleInput } from "./components/BlogTitleInput";
import { BlogSlugInput } from "./components/BlogSlugInput";
import { BlogExcerptInput } from "./components/BlogExcerptInput";
import { BlogMetaDescription } from "./components/BlogMetaDescription";
import { BlogPublishToggle } from "./components/BlogPublishToggle";

interface BlogFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    meta_description?: string;
    published?: boolean;
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function BlogForm({ initialData, onSubmit, isLoading }: BlogFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
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