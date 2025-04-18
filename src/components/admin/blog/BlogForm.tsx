
import { useState, useEffect } from "react";
import { BlogFormContent } from "./components/BlogFormContent";
import { BlogFormFooter } from "./components/BlogFormFooter";
import { useBlogFormSubmit } from "./hooks/useBlogFormSubmit";
import { initializeBlogStorage } from "./utils/initializeStorage";

interface BlogFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    published?: boolean;
    categories?: string[];
    tags?: string[];
    cover_image?: string;
    created_at?: string;
  };
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

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    published: initialData?.published || false,
    categories: Array.isArray(initialData?.categories) ? initialData.categories : [],
    tags: Array.isArray(initialData?.tags) ? initialData.tags : [],
    cover_image: initialData?.cover_image || "",
    created_at: initialData?.created_at || new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize blog storage when component mounts
  useEffect(() => {
    initializeBlogStorage();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.slug) newErrors.slug = "Slug is required";
    if (!formData.content) newErrors.content = "Content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await submitForm(formData);
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
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <BlogFormContent 
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
        blogId={blogId}
        isEdit={isEdit}
      />
      <BlogFormFooter isLoading={isLoading} />
    </form>
  );
}
