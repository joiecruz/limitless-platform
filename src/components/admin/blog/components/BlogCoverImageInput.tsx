
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image } from "lucide-react";
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

  // Check if user is admin or superadmin
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_superadmin, is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      return data;
    }
  });
  
  // Check if user can upload images
  const canUpload = profile?.is_superadmin || profile?.is_admin;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if user has permission
    if (!canUpload) {
      toast({
        title: "Unauthorized",
        description: "Only admins can upload blog cover images",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // First check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      // Create a unique file name using the blog ID or a timestamp if new blog
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-cover-${blogId || Date.now()}.${fileExt}`;

      // Create the bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const blogCoversBucketExists = buckets?.some(b => b.name === 'blog-covers');
      
      if (!blogCoversBucketExists) {
        await supabase.storage.createBucket('blog-covers', {
          public: true
        });
      }

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('blog-covers')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-covers')
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
    <div className="space-y-4">
      <div>
        <Label>Cover Image</Label>
        <div className="flex items-center gap-2 mt-1.5">
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Cover image URL" 
            className="flex-1"
          />
          {canUpload && (
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
                <label htmlFor="cover-image-upload" className="cursor-pointer flex items-center">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload
                </label>
              </Button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
      
      {value && (
        <div className="relative rounded-md overflow-hidden border border-input h-48 w-full bg-muted/20">
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
