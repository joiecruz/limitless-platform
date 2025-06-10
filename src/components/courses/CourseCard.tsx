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
  format: string;
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

  // Check if user has explicit access to the course
  const { data: hasAccess } = useQuery({
    queryKey: ["course-access", course.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data } = await supabase
        .from('user_course_access')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('course_id', course.id)
        .maybeSingle();

      return !!data;
    },
  });

  // Check if user is authenticated
  const { data: isAuthenticated } = useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    },
  });

  // Fetch actual counts - this will be the source of truth
  const { data: actualCounts } = useQuery({
    queryKey: ["course-counts", course.id],
    queryFn: async () => {
      const [enrollmentsResult, lessonsResult] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id),
        supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', course.id)
      ]);

      return {
        enrolleeCount: enrollmentsResult.count || 0,
        lessonCount: lessonsResult.count || 0
      };
    },
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true,
  });

  // Course is accessible if it's not locked, user has explicit access, or is enrolled
  const isAccessible = !course.locked || hasAccess || !!enrollment;

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
        lessonCount={actualCounts?.lessonCount || 0}
        enrolleeCount={actualCounts?.enrolleeCount || 0}
        isEnrolled={!!enrollment}
        isLocked={!isAccessible}
        format={course.format}
        showEnrolleeCount={isAdmin || false}
      />
      {isAuthenticated && (
        <CardContent className="space-y-4">
          <CourseActions
            courseId={course.id}
            courseTitle={course.title}
            isLocked={!isAccessible}
            isEnrolled={!!enrollment}
            progress={enrollment?.progress}
            onEnroll={onEnroll}
            isEnrolling={isEnrolling}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default CourseCard;
