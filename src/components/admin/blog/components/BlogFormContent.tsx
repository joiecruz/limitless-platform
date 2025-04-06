
import { RichTextEditor } from "../RichTextEditor";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BlogCoverImageInput } from "./BlogCoverImageInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogTagsInput } from "./BlogTagsInput";
import { BlogPublishToggle } from "./BlogPublishToggle";
import { BlogFormValues } from "../BlogForm";

interface BlogFormContentProps {
  form: UseFormReturn<BlogFormValues>;
  blogId?: string | null;
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
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="created_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  value={new Date(field.value).toISOString().substring(0, 10)}
                  onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
          <FormItem>
            <FormLabel>Cover Image</FormLabel>
            <FormControl>
              <BlogCoverImageInput
                value={field.value}
                onChange={field.onChange}
                error=""
                blogId={blogId || ""}
              />
            </FormControl>
            {field.value && (
              <div className="mt-2">
                <img 
                  src={field.value} 
                  alt="Cover preview" 
                  className="max-h-48 rounded-lg object-cover"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excerpt</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="meta_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categories"
        render={({ field }) => (
          <BlogCategorySelect
            value={field.value}
            onChange={field.onChange}
            error=""
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
            error=""
          />
        )}
      />
    </div>
  );
}
