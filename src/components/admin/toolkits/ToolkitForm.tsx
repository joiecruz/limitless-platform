
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface ToolkitFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isLoading?: boolean;
}

export function ToolkitForm({ onSubmit, defaultValues, isLoading }: ToolkitFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(defaultValues?.cover_image_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: defaultValues || {
      name: "",
      description: "",
      category: "Innovation Process and Tools",
      cover_image_url: "",
      about_this_tool: "",
      use_cases: "",
      how_to_use: "",
      when_to_use: "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `toolkit-covers/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('toolkit-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('toolkit-attachments')
        .getPublicUrl(filePath);

      setCoverImageUrl(publicUrl);
      form.setValue('cover_image_url', publicUrl);
      
      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeCoverImage = () => {
    setCoverImageUrl("");
    form.setValue('cover_image_url', "");
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, cover_image_url: coverImageUrl });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter toolkit name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter category" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter toolkit description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Cover Image</FormLabel>
          <div className="space-y-4">
            {coverImageUrl ? (
              <div className="relative">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full max-w-sm h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeCoverImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Upload a cover image</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Choose Image"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="about_this_tool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About This Tool</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter detailed information about this toolkit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="use_cases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Use Cases</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the main use cases for this toolkit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="how_to_use"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How to Use</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Provide instructions on how to use this toolkit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="when_to_use"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When to Use</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe when this toolkit should be used" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
