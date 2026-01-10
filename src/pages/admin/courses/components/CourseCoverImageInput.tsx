import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface CourseCoverImageInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CourseCoverImageInput({ value, onChange, error }: CourseCoverImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `course-cover-${Date.now()}.${fileExt}`;

      // Upload the file to course-covers bucket
      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(fileName);

      onChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Cover Image</Label>
      <div className="flex items-center gap-2">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Cover image URL" 
          className="flex-1"
        />
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="course-cover-upload"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isUploading}
          >
            <label htmlFor="course-cover-upload" className="cursor-pointer flex items-center">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload
            </label>
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      
      {value && (
        <div className="relative rounded-md overflow-hidden border border-input h-32 w-full bg-muted/20">
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
    </div>
  );
}
