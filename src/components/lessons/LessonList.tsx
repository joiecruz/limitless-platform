import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Video, CheckCircle } from "lucide-react";
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

  // Fetch completed lessons for the current user
  const { data: completedLessons = [] } = useQuery({
    queryKey: ["completedLessons", courseId],
    queryFn: async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) return [];

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("completed_lessons")
        .eq("course_id", courseId)
        .eq("user_id", userSession.session.user.id)
        .single();

      return enrollment?.completed_lessons || [];
    },
  });

  const isReleaseDateLocked = (releaseDate: string) => {
    return new Date(releaseDate) > new Date();
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  // Get all lessons sorted by order for ladderized progression
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  // Check if a lesson is locked based on ladderized progression
  const isLessonLocked = (lesson: Lesson) => {
    // First check release date
    if (isReleaseDateLocked(lesson.release_date)) {
      return { locked: true, reason: 'release_date' as const, releaseDate: lesson.release_date };
    }
    
    // First lesson is always unlocked (if release date has passed)
    const lessonIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
    if (lessonIndex === 0) {
      return { locked: false, reason: null };
    }
    
    // Check if all previous lessons are completed
    for (let i = 0; i < lessonIndex; i++) {
      if (!isLessonCompleted(sortedLessons[i].id)) {
        return { locked: true, reason: 'progression' as const, previousLesson: sortedLessons[i].title };
      }
    }
    
    return { locked: false, reason: null };
  };

  const handleLessonClick = (lesson: Lesson) => {
    const lockStatus = isLessonLocked(lesson);
    
    if (lockStatus.locked) {
      if (lockStatus.reason === 'release_date') {
        toast({
          title: "Lesson Locked",
          description: `This lesson will be available on ${format(
            new Date(lockStatus.releaseDate!),
            "MMMM dd, yyyy"
          )}`,
        });
      } else {
        toast({
          title: "Complete Previous Lesson",
          description: `Please complete "${lockStatus.previousLesson}" first to unlock this lesson.`,
        });
      }
      return;
    }

    navigate(`/dashboard/courses/${courseId}/lessons/${lesson.id}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Course content</h2>
      <div className="space-y-2">
        {sortedLessons.map((lesson) => {
          const lockStatus = isLessonLocked(lesson);
          const locked = lockStatus.locked;
          const completed = isLessonCompleted(lesson.id);
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
                  <CheckCircle className="w-5 h-5 text-primary" />
                ) : (
                  <Video className="w-5 h-5 text-primary" />
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