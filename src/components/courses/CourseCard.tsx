import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Upload } from "lucide-react";
import CourseEnrollment from "./CourseEnrollment";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lesson_count: number;
  enrollee_count: number;
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', course.id);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-course-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      toast({
        title: "Success",
        description: "Course image updated successfully",
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
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white">Uploading...</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <CourseEnrollment
          courseId={course.id}
          courseTitle={course.title}
          isEnrolled={!!enrollment}
          progress={enrollment?.progress}
          onEnroll={onEnroll}
          isEnrolling={isEnrolling}
        />
      </CardContent>
    </Card>
  );
};

export default CourseCard;