import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseImage from "./CourseImage";
import CourseDetails from "./CourseDetails";
import CourseActions from "./CourseActions";

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CourseImage 
        courseId={course.id}
        imageUrl={course.image_url}
        isAdmin={isAdmin || false}
      />
      <CourseDetails 
        title={course.title}
        description={course.description}
        lessonCount={course.lesson_count}
        enrolleeCount={course.enrollee_count}
        isEnrolled={!!enrollment}
        isLocked={course.locked}
      />
      <CardContent className="space-y-4">
        <CourseActions 
          courseId={course.id}
          courseTitle={course.title}
          isLocked={course.locked}
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