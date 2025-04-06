
import { UseFormReturn } from "react-hook-form";
import { RichTextEditor } from "../RichTextEditor";
import { BlogTitleInput } from "./BlogTitleInput";
import { BlogSlugInput } from "./BlogSlugInput";
import { BlogExcerptInput } from "./BlogExcerptInput";
import { BlogMetaDescription } from "./BlogMetaDescription";
import { BlogCoverImageInput } from "./BlogCoverImageInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogTagsInput } from "./BlogTagsInput";
import { BlogPublishToggle } from "./BlogPublishToggle";
import { BlogDateInput } from "./BlogDateInput";
import { BlogFormValues } from "../BlogForm";
import { FormField } from "@/components/ui/form";

interface BlogFormContentProps {
  form: UseFormReturn<BlogFormValues>;
  blogId?: string;
  isEdit?: boolean;
}

export function BlogFormContent({ 
  form,
  blogId,
  isEdit
}: BlogFormContentProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <BlogTitleInput
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.title?.message}
          />
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <BlogSlugInput
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.slug?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="created_at"
          render={({ field }) => (
            <BlogDateInput
              label="Publication Date"
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.created_at?.message}
              description="The date this post will appear to be published on"
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <BlogPublishToggle
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="cover_image"
        render={({ field }) => (
          <BlogCoverImageInput
            value={field.value || ""}
            onChange={field.onChange}
            error={form.formState.errors.cover_image?.message}
            blogId={blogId}
          />
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <div className="space-y-2">
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <BlogExcerptInput
            value={field.value || ""}
            onChange={field.onChange}
            error={form.formState.errors.excerpt?.message}
          />
        )}
      />

      <FormField
        control={form.control}
        name="meta_description"
        render={({ field }) => (
          <BlogMetaDescription
            value={field.value || ""}
            onChange={field.onChange}
            error={form.formState.errors.meta_description?.message}
          />
        )}
      />

      <FormField
        control={form.control}
        name="categories"
        render={({ field }) => (
          <BlogCategorySelect
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.categories?.message}
          />
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <BlogTagsInput
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.tags?.message}
          />
        )}
      />
    </div>
  );
}
