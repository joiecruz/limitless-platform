
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Plus } from "lucide-react";
import { BlogFormContent } from "./components/BlogFormContent";
import { useBlogFormSubmit } from "./hooks/useBlogFormSubmit";
import { BlogFormActions } from "./components/BlogFormActions";

interface CreateBlogDialogProps {
  onSuccess: () => void;
}

export function CreateBlogDialog({ onSuccess }: CreateBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const { handleSubmit, isLoading } = useBlogFormSubmit({ onSuccess: () => {
    setOpen(false);
    onSuccess();
  }});

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    meta_description: "",
    cover_image: "",
    published: false,
    categories: [],
    tags: [],
    created_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.slug) newErrors.slug = "Slug is required";
    if (!formData.content) newErrors.content = "Content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitForm = () => {
    if (validateForm()) {
      handleSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Blog Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>
        <Form>
          <div className="py-4">
            <BlogFormContent 
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />

            <div className="flex justify-end mt-6 space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={onSubmitForm}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Post
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
