import { RichTextEditor } from "../RichTextEditor";
import { BlogTitleInput } from "./BlogTitleInput";
import { BlogSlugInput } from "./BlogSlugInput";
import { BlogExcerptInput } from "./BlogExcerptInput";
import { BlogMetaDescription } from "./BlogMetaDescription";
import { BlogCoverImageInput } from "./BlogCoverImageInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogTagsInput } from "./BlogTagsInput";
import { BlogPublishToggle } from "./BlogPublishToggle";
import { BlogFormHeader } from "./BlogFormHeader";

interface BlogFormContentProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
  blogId?: string;
  isEdit?: boolean;
}

export function BlogFormContent({ 
  formData, 
  updateFormData, 
  errors,
  blogId,
  isEdit
}: BlogFormContentProps) {
  return (
    <div className="space-y-6">
      <BlogFormHeader title={isEdit ? "Edit Blog Post" : "Create New Blog Post"} />
      
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

      <BlogCoverImageInput
        value={formData.cover_image}
        onChange={(value) => updateFormData("cover_image", value)}
        error={errors.cover_image}
        blogId={blogId}
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

      <BlogCategorySelect
        value={formData.categories}
        onChange={(value) => updateFormData("categories", value)}
        error={errors.categories}
      />

      <BlogTagsInput
        value={formData.tags}
        onChange={(value) => updateFormData("tags", value)}
        error={errors.tags}
      />

      <BlogPublishToggle
        value={formData.published}
        onChange={(value) => updateFormData("published", value)}
      />
    </div>
  );
}