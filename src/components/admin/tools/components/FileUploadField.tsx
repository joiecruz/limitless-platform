import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadFieldProps {
  form: any;
  name: string;
  label: string;
  accept?: string;
  bucket: string;
}

export function FileUploadField({ form, name, label, accept, bucket }: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      form.setValue(name, publicUrl);
      
      toast({
        title: "File uploaded",
        description: "The file has been successfully uploaded.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input {...field} readOnly placeholder="Upload a file..." />
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-[200px]"
                  disabled={isUploading}
                  onClick={() => document.getElementById(`${name}-upload`)?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload {label}
                </Button>
                {field.value && (
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline self-center"
                  >
                    View file
                  </a>
                )}
              </div>
              <Input
                id={`${name}-upload`}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}