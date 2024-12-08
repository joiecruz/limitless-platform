import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import LessonSidebar from "@/components/lessons/LessonSidebar";
import VideoPlayer from "@/components/lessons/VideoPlayer";
import LessonContent from "@/components/lessons/LessonContent";
import LessonNavigation from "@/components/lessons/LessonNavigation";
import LessonBodyContent from "@/components/lessons/LessonBodyContent";

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

      // First check if enrollment exists
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("course_id", courseId)
        .single();

      if (existingEnrollment) {
        // Update existing enrollment
        const { error: updateError } = await supabase
          .from("enrollments")
          .update({
            progress: Math.round(((currentIndex + 1) / totalLessons) * 100),
          })
          .eq("user_id", session.user.id)
          .eq("course_id", courseId);

        if (updateError) throw updateError;
      } else {
        // Create new enrollment
        const { error: insertError } = await supabase
          .from("enrollments")
          .insert({
            user_id: session.user.id,
            course_id: courseId,
            progress: Math.round(((currentIndex + 1) / totalLessons) * 100),
          });

        if (insertError) throw insertError;
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
            {/* Header and description */}
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">
                Lesson {currentIndex + 1} of {totalLessons}
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">{lesson.title}</h1>
              {lesson.description && (
                <div className="prose max-w-none mt-4">
                  <p className="text-gray-600">{lesson.description}</p>
                </div>
              )}
            </div>

            {/* Video player */}
            {lesson.video_url && <VideoPlayer videoUrl={lesson.video_url} />}
            
            {/* Lesson body content */}
            <LessonBodyContent content={lesson.body_content} />

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
