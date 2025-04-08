
import { RichTextEditor } from "../RichTextEditor";
import { BlogTitleInput } from "./BlogTitleInput";
import { BlogSlugInput } from "./BlogSlugInput";
import { BlogExcerptInput } from "./BlogExcerptInput";
import { BlogCoverImageInput } from "./BlogCoverImageInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogTagsInput } from "./BlogTagsInput";
import { BlogPublishToggle } from "./BlogPublishToggle";
import { BlogDateInput } from "./BlogDateInput";

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
  // Ensure categories and tags are always arrays
  const categories = Array.isArray(formData.categories) ? formData.categories : [];
  const tags = Array.isArray(formData.tags) ? formData.tags : [];

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlogDateInput
          label="Publication Date"
          value={formData.created_at}
          onChange={(value) => updateFormData("created_at", value)}
          error={errors.created_at}
          description="The date this post will appear to be published on"
        />
        
        <BlogPublishToggle
          value={formData.published}
          onChange={(value) => updateFormData("published", value)}
        />
      </div>

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
          blogId={blogId}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <BlogExcerptInput
        value={formData.excerpt}
        onChange={(value) => updateFormData("excerpt", value)}
        error={errors.excerpt}
        label="Excerpt"
        description="Brief summary of the article that will appear in previews"
      />

      <BlogCategorySelect
        value={categories}
        onChange={(value) => updateFormData("categories", value)}
        error={errors.categories}
      />

      <BlogTagsInput
        value={tags}
        onChange={(value) => updateFormData("tags", value)}
        error={errors.tags}
      />
    </div>
  );
}
