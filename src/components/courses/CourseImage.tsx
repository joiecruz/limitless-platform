import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CourseImageProps {
  courseId: string;
  imageUrl: string;
  isAdmin: boolean;
}

const CourseImage = ({ courseId, imageUrl, isAdmin }: CourseImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSuperAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_superadmin')
          .eq('id', user.id)
          .single();
        
        setIsSuperAdmin(!!profile?.is_superadmin);
      }
    };

    checkSuperAdmin();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only superadmins can upload course images.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${courseId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('courses')
        .update({ image_url: publicUrl })
        .eq('id', courseId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Course image updated successfully",
      });

      window.location.reload();
    } catch (error) {
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
    <div className="aspect-video relative group">
      <img
        src={imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'}
        alt="Course cover"
        className="object-cover w-full h-full"
      />
      {isAdmin && isSuperAdmin && (
        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Upload className="h-6 w-6 text-white" />
          <span className="ml-2 text-white">Upload Cover</span>
        </label>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default CourseImage;