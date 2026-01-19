import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import LessonSidebar from "@/components/lessons/LessonSidebar";
import LessonHeader from "@/components/lessons/LessonHeader";
import LessonContent from "@/components/lessons/LessonContent";
import LessonNavigation from "@/components/lessons/LessonNavigation";
import MobileLessonHeader from "@/components/lessons/MobileLessonHeader";

const Lesson = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  // Fetch course sections
  const { data: sections = [] } = useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("course_sections")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (error) {
        console.error("Failed to load sections:", error);
        return [];
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

      // Get current enrollment to get completed_lessons
      const { data: enrollment, error: fetchError } = await supabase
        .from("enrollments")
        .select("id, completed_lessons")
        .eq("user_id", session.user.id)
        .eq("course_id", courseId)
        .single();

      if (fetchError) throw fetchError;

      // Get completed lessons or initialize empty array
      const completedLessons: string[] = enrollment?.completed_lessons || [];

      // Add current lesson if not already completed
      if (lessonId && !completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // Calculate progress based on completed lessons
      const progress = Math.round((completedLessons.length / totalLessons) * 100);

      // Update enrollment with completed lessons and progress
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({
          completed_lessons: completedLessons,
          progress: progress,
        })
        .eq("user_id", session.user.id)
        .eq("course_id", courseId);

      if (updateError) throw updateError;

      // Invalidate queries to refresh data in real-time
      await queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      await queryClient.invalidateQueries({ queryKey: ["completedLessons", courseId] });

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
      {/* Mobile header with hamburger menu */}
      <MobileLessonHeader
        lessons={lessons}
        sections={sections}
        currentLessonId={lessonId!}
        courseId={courseId!}
        currentIndex={currentIndex}
        totalLessons={totalLessons}
        lessonTitle={lesson.title}
      />

      <div className="flex flex-col md:flex-row">
        {/* Desktop sidebar - hidden on mobile */}
        <LessonSidebar
          lessons={lessons}
          sections={sections}
          currentLessonId={lessonId}
          courseId={courseId!}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />

        <div className={`flex-1 overflow-auto transition-all duration-300 ${
          isOpen ? 'md:ml-80' : 'ml-0'
        }`}>
          <div className="w-full">
            {/* Video section - full width on mobile, no gaps */}
            <div className="md:max-w-4xl md:mx-auto md:py-8 md:px-0">
              {/* Desktop header - hidden on mobile */}
              <div className="hidden md:block">
                <LessonHeader
                  title={lesson.title}
                  description={lesson.description}
                  currentIndex={currentIndex}
                  totalLessons={totalLessons}
                />
              </div>
              
              <LessonContent
                videoUrl={lesson.video_url}
                bodyContent={lesson.body_content}
              />

              <div className="px-4 md:px-6">
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
