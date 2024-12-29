import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save } from "lucide-react";

interface PageEditorProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    content: any;
    meta_description?: string;
    published?: boolean;
  };
  mode?: 'create' | 'edit';
}

export function PageEditor({ initialData, mode = 'create' }: PageEditorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    slug: '',
    content: {},
    meta_description: '',
    published: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        const { error } = await supabase
          .from('pages')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page created successfully",
        });
      } else {
        const { error } = await supabase
          .from('pages')
          .update(formData)
          .eq('id', initialData?.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page updated successfully",
        });
      }

      navigate('/admin/pages');
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

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/pages')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pages
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Create New Page' : 'Edit Page'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Page Title</label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">URL Slug</label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="e.g., about-us"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="meta_description" className="text-sm font-medium">
            Meta Description
          </label>
          <Textarea
            id="meta_description"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            placeholder="Brief description for search engines"
            className="h-20"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Page'}
          </Button>
        </div>
      </form>
    </div>
  );
}