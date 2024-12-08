import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Upload, Lock } from "lucide-react";
import CourseEnrollment from "./CourseEnrollment";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lesson_count: number;
  enrollee_count: number;
  locked: boolean;
}

interface CourseCardProps {
  course: Course;
  enrollment?: {
    course_id: string;
    progress: number;
  };
  onEnroll: () => void;
  isEnrolling: boolean;
}

const CourseCard = ({ course, enrollment, onEnroll, isEnrolling }: CourseCardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Query to check if the current user is an admin
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      return data?.is_admin || false;
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${course.id}.${fileExt}`;

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
        .eq('id', course.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Course image updated successfully",
      });

      // Force a page reload to show the new image
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative group">
        <img
          src={course.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'}
          alt={course.title}
          className="object-cover w-full h-full"
        />
        {isAdmin && (
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
      <CardHeader>
        <CardTitle className="leading-[1.2]">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!enrollment && !course.locked && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.lesson_count || 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.enrollee_count || 0} enrolled</span>
            </div>
          </div>
        )}
        
        {course.locked ? (
          <button 
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            disabled
          >
            <Lock className="h-4 w-4" />
            Coming Soon
          </button>
        ) : (
          <CourseEnrollment
            courseId={course.id}
            courseTitle={course.title}
            isEnrolled={!!enrollment}
            progress={enrollment?.progress}
            onEnroll={onEnroll}
            isEnrolling={isEnrolling}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;