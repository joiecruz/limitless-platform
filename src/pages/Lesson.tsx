import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import LessonSidebar from "@/components/lessons/LessonSidebar";
import VideoPlayer from "@/components/lessons/VideoPlayer";
import LessonNavigation from "@/components/lessons/LessonNavigation";
import LessonContent from "@/components/lessons/LessonContent";

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
      const { error: enrollmentError } = await supabase
        .from("enrollments")
        .upsert({
          user_id: session.user.id,
          course_id: courseId,
          progress: Math.round(((currentIndex + 1) / totalLessons) * 100),
        });

      if (enrollmentError) {
        throw enrollmentError;
      }

      toast({
        title: "Progress saved",
        description: "Lesson marked as complete",
      });

      // Navigate to next lesson if available
      if (nextLesson) {
        navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
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
      <div className="flex">
        <LessonSidebar
          lessons={lessons}
          currentLessonId={lessonId!}
          courseId={courseId!}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />

        <div className={`flex-1 overflow-auto transition-all duration-300 ${
          isOpen ? 'ml-80' : 'ml-0'
        }`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <LessonContent
              title={lesson.title}
              description={lesson.description}
              bodyContent={lesson.body_content}
              currentIndex={currentIndex}
              totalLessons={totalLessons}
            />

            {lesson.video_url && <VideoPlayer videoUrl={lesson.video_url} />}

            <div className="prose max-w-none mt-8">
              <div className="text-gray-800 space-y-6">
                {lesson.body_content || lesson.description || "No content available for this lesson."}
              </div>
            </div>

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
  );
};

export default Lesson;