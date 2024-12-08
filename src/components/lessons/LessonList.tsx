import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, PlayCircle, CircleCheck } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  release_date: string;
  order: number;
  duration: number | null;
}

interface LessonListProps {
  lessons: Lesson[];
  courseId: string;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, courseId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user's enrollment to check lesson completion
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", session.user.id)
        .single();

      return data;
    },
  });

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

  // Calculate if a lesson is completed based on progress
  const isLessonCompleted = (lessonOrder: number) => {
    if (!enrollment?.progress) return false;
    const lessonProgress = (lessonOrder / lessons.length) * 100;
    return enrollment.progress >= lessonProgress;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Course content</h2>
      <div className="space-y-2">
        {lessons.map((lesson) => {
          const locked = isLessonLocked(lesson.release_date);
          const completed = isLessonCompleted(lesson.order);
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
                ) : completed ? (
                  <CircleCheck className="w-5 h-5 text-primary fill-primary stroke-white" />
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
  );
};

export default LessonList;