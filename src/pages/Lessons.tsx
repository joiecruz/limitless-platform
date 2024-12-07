import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Lesson {
  id: string;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
}

const mockLessons: Lesson[] = [
  { id: "1", title: "Lesson 0: Welcome to the Limitel", isCompleted: true, isLocked: false },
  { id: "2", title: "Identifying Community Needs through AI-Powered Research", isCompleted: true, isLocked: false },
  { id: "3", title: "Empathy and Problem Definition with AI Insights", isCompleted: false, isLocked: false },
  { id: "4", title: "Ideation and Brainstorming with AI Assistance", isCompleted: false, isLocked: true },
];

const Lessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();

  // Fetch course details
  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
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

  // Fetch enrollment status
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
  if (courseLoading || enrollmentLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (courseError) {
    return <div>Error loading course. Please try again later.</div>;
  }

  // Course not found
  if (!course) {
    return <div>Course not found</div>;
  }

  const completedLessons = mockLessons.filter(lesson => lesson.isCompleted).length;
  const progress = (completedLessons / mockLessons.length) * 100;

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
              <span>{completedLessons}/{mockLessons.length} lessons completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course content</h2>
          <div className="space-y-2">
            {mockLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  lesson.isCompleted ? "bg-primary-50" : "bg-white"
                }`}
              >
                <div className="flex-shrink-0">
                  {lesson.isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : lesson.isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <span className={lesson.isLocked ? "text-muted-foreground" : ""}>
                  {lesson.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;