import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Lock, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  const navigate = useNavigate();

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
        console.error("Error fetching course:", error);
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
        console.error("Error fetching lessons:", error);
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
        console.error("Error fetching enrollment:", error);
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

  const isLessonLocked = (releaseDate: string) => {
    return new Date(releaseDate) > new Date();
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (isLessonLocked(lesson.release_date)) {
      toast({
        title: "Lesson Locked",
        description: `This lesson will be available on ${format(
          new Date(lesson.release_date),
          "MMMM dd, yyyy"
        )}`,
      });
      return;
    }

    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{course.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your progress and complete the lessons
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Course progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{enrollment?.progress || 0}% completed</span>
            </div>
            <Progress value={enrollment?.progress || 0} className="h-2" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course content</h2>
          <div className="space-y-2">
            {lessons.map((lesson) => {
              const locked = isLessonLocked(lesson.release_date);
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  disabled={locked}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border ${
                    locked
                      ? "bg-gray-50 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {locked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={`font-medium ${
                        locked ? "text-muted-foreground" : ""
                      }`}
                    >
                      {lesson.title}
                    </div>
                    {lesson.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                  {lesson.duration && (
                    <div className="text-sm text-muted-foreground">
                      {lesson.duration} min
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;