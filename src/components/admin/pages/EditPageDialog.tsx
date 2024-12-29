import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditPageDialogProps {
  pageId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPageDialog({ pageId, isOpen, onClose, onSuccess }: EditPageDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_description: "",
    content: {},
  });

  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId) return;
      
      try {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("id", pageId)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            title: data.title,
            slug: data.slug,
            meta_description: data.meta_description || "",
            content: data.content,
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    if (isOpen && pageId) {
      fetchPage();
    }
  }, [pageId, isOpen, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("pages")
        .update(formData)
        .eq("id", pageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page updated successfully",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="e.g. about-us"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              placeholder="Brief description for search engines"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}