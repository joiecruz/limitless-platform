import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface BlogCoverImageInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  blogId?: string;
}

export function BlogCoverImageInput({ value, onChange, error, blogId }: BlogCoverImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${blogId || 'new'}-cover.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-covers')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Cover Image</Label>
      <div className="flex gap-2">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Cover image URL" 
        />
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="cover-image-upload"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isUploading}
          >
            <label htmlFor="cover-image-upload" className="cursor-pointer">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </label>
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}