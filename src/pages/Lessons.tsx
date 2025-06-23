import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CourseHeader from "@/components/lessons/CourseHeader";
import CourseProgress from "@/components/lessons/CourseProgress";
import LessonList from "@/components/lessons/LessonList";

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  release_date: string;
  order: number;
  duration: number | null;
}

const Lessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) {
        
        toast({
          title: "Error",
          description: "Failed to load course details. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!courseId,
  });

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order");

      if (error) {
        
        toast({
          title: "Error",
          description: "Failed to load lessons. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      return data as Lesson[];
    },
    enabled: !!courseId,
  });

  // Fetch enrollment and progress
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) return null;

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", userSession.session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        
        toast({
          title: "Error",
          description: "Failed to load enrollment details. Please try again later.",
          variant: "destructive",
        });
      }

      return data;
    },
    enabled: !!courseId,
  });

  // Loading states
  if (courseLoading || lessonsLoading || enrollmentLoading) {
    return <div>Loading...</div>;
  }

  // Course not found
  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="animate-fade-in pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <CourseHeader
        title={course.title}
        description="Track your progress and complete the lessons"
      />

      <div className="space-y-8">
        <CourseProgress progress={enrollment?.progress || 0} />
        <LessonList lessons={lessons} courseId={courseId!} />
      </div>
    </div>
  );
};

export default Lessons;
