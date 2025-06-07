
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText } from "lucide-react";

interface ToolkitItemFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ToolkitItemForm({ onSubmit, defaultValues, isLoading, onCancel }: ToolkitItemFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(defaultValues?.file_url || "");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      file_url: "",
      order_index: 0,
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Allow various file types including PDFs, docs, images, etc.
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a PDF, document, image, or other supported file type",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "Error",
        description: "File must be less than 50MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `toolkit-files/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('toolkit-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('toolkit-attachments')
        .getPublicUrl(filePath);

      setFileUrl(publicUrl);
      setFileName(file.name);
      form.setValue('file_url', publicUrl);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = (data: any) => {
    if (!fileUrl) {
      toast({
        title: "Error",
        description: "Please upload a file",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ ...data, file_url: fileUrl });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter file title (e.g., 'Canvas Template', 'Guide PDF')" />
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
              <FormLabel>File Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe what this file contains and how it should be used" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Upload File</FormLabel>
          <div className="space-y-4">
            {fileUrl ? (
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">{fileName || "Uploaded file"}</p>
                  <p className="text-sm text-gray-500">File uploaded successfully</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileUrl, '_blank')}
                >
                  View
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Upload a file (PDF, DOC, XLS, PPT, images, etc.)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
