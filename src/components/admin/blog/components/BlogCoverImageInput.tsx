import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

interface BlogCoverImageInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  blogId?: string;
}

export function BlogCoverImageInput({ value, onChange, error, blogId }: BlogCoverImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Check if user is superadmin
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_superadmin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if user is superadmin
    if (!profile?.is_superadmin) {
      toast({
        title: "Unauthorized",
        description: "Only superadmins can upload blog cover images",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${blogId || 'new'}-cover.${fileExt}`;

      // First check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      const { error: uploadError, data } = await supabase.storage
        .from('blog-covers')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error uploading:', uploadError);
        throw new Error(uploadError.message);
      }

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
      <div className="flex gap-2">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Cover image URL" 
        />
        {profile?.is_superadmin && (
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
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}