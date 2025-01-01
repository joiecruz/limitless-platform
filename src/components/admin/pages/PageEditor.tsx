import { useState } from "react";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { PageTitleInput } from "./components/PageTitleInput";
import { PageSlugInput } from "./components/PageSlugInput";
import { PageMetaDescription } from "./components/PageMetaDescription";
import { PagePublishToggle } from "./components/PagePublishToggle";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageEditorProps {
  pageId?: string;
  initialData?: {
    title: string;
    slug: string;
    content: any;
    meta_description?: string;
    published?: boolean;
  };
  onSuccess?: () => void;
}

export function PageEditor({ pageId, initialData, onSuccess }: PageEditorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || { html: "" },
    meta_description: initialData?.meta_description || "",
    published: initialData?.published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (pageId) {
        const { error } = await supabase
          .from('pages')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pageId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('pages')
          .insert([{
            ...formData,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page created successfully",
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PageTitleInput
          value={formData.title}
          onChange={(title) => setFormData(prev => ({ ...prev, title }))}
        />

        <PageSlugInput
          value={formData.slug}
          onChange={(slug) => setFormData(prev => ({ ...prev, slug }))}
        />

        <PageMetaDescription
          value={formData.meta_description}
          onChange={(meta_description) => setFormData(prev => ({ ...prev, meta_description }))}
        />

        <div>
          <Label>Content</Label>
          <ScrollArea className="h-[400px] mt-2">
            <RichTextEditor
              value={formData.content.html || ""}
              onChange={(html) => setFormData(prev => ({ ...prev, content: { html } }))}
            />
          </ScrollArea>
        </div>

        <PagePublishToggle
          checked={formData.published}
          onCheckedChange={(published) => setFormData(prev => ({ ...prev, published }))}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}