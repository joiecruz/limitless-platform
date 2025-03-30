
import { useState } from "react";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Image } from "lucide-react";
import { PageTitleInput } from "./components/PageTitleInput";
import { PageSlugInput } from "./components/PageSlugInput";
import { PagePublishToggle } from "./components/PagePublishToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PageEditorProps {
  pageId?: string;
  initialData?: {
    title: string;
    slug: string;
    content: any;
    published?: boolean;
    meta_image?: string;
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
    published: initialData?.published || false,
    meta_image: initialData?.meta_image || "",
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

        <div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="meta_image">SEO Image</Label>
            <span className="text-xs text-muted-foreground">(Used when page is shared on social media)</span>
          </div>
          <Input
            id="meta_image"
            placeholder="Enter image URL for social media sharing"
            value={formData.meta_image}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_image: e.target.value }))}
            className="mt-1"
          />
          {formData.meta_image && (
            <div className="mt-2 relative w-full max-w-md h-32 rounded-md overflow-hidden border border-gray-200">
              <img
                src={formData.meta_image}
                alt="SEO Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png";
                }}
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />

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
