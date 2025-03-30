
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import LessonSidebar from "@/components/lessons/LessonSidebar";
import LessonHeader from "@/components/lessons/LessonHeader";
import LessonContent from "@/components/lessons/LessonContent";
import LessonNavigation from "@/components/lessons/LessonNavigation";

const Lesson = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  // Fetch lesson details
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      if (!lessonId) throw new Error("Lesson ID is required");

      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (error) {
        console.error("Error fetching lesson:", error);
        toast({
          title: "Error",
          description: "Failed to load lesson details. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!lessonId,
  });

  // Fetch all lessons for navigation
  const { data: lessons = [] } = useQuery({
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

      return data;
    },
    enabled: !!courseId,
  });

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const totalLessons = lessons.length;
  const nextLesson = lessons[currentIndex + 1];
  const previousLesson = lessons[currentIndex - 1];

  const handleComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to track your progress",
          variant: "destructive",
        });
        return;
      }

      // Update enrollment progress
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({
          progress: Math.round(((currentIndex + 1) / totalLessons) * 100),
        })
        .eq("user_id", session.user.id)
        .eq("course_id", courseId);

      if (updateError) throw updateError;

      toast({
        title: "Progress saved",
        description: "Lesson marked as complete",
      });

      // Navigate to next lesson if available
      if (nextLesson) {
        navigate(`/dashboard/courses/${courseId}/lessons/${nextLesson.id}`);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (lessonLoading) {
    return <div>Loading...</div>;
  }

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <LessonSidebar
          lessons={lessons}
          currentLessonId={lessonId}
          courseId={courseId!}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />

        <div className={`flex-1 overflow-auto transition-all duration-300 ${
          isOpen ? 'md:ml-80' : 'ml-0'
        }`}>
          <div className="w-full">
            <div className="w-full max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-0">
              <LessonHeader
                title={lesson.title}
                description={lesson.description}
                currentIndex={currentIndex}
                totalLessons={totalLessons}
              />
              
              <LessonContent
                videoUrl={lesson.video_url}
                bodyContent={lesson.body_content}
              />

              <div className="px-2 md:px-6">
                <LessonNavigation
                  previousLesson={previousLesson}
                  nextLesson={nextLesson}
                  courseId={courseId!}
                  onComplete={handleComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lesson;
