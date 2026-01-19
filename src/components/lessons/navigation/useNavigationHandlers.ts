import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useNavigationHandlers = (courseId: string, onComplete: () => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      // Get current lesson ID from URL
      const currentLessonId = window.location.pathname.split('/').pop();
      if (!currentLessonId) return;

      // First check if enrollment exists and get completed lessons
      const { data: existingEnrollment, error: fetchError } = await supabase
        .from("enrollments")
        .select("id, completed_lessons")
        .eq("user_id", session.user.id)
        .eq("course_id", courseId)
        .single();

      if (fetchError) {
        console.error("Error fetching enrollment:", fetchError);
        return;
      }

      // Get all completed lessons or initialize empty array
      const completedLessons = existingEnrollment?.completed_lessons || [];

      // Add current lesson if not already completed
      if (!completedLessons.includes(currentLessonId)) {
        completedLessons.push(currentLessonId);
      }

      // Get total lessons count for progress calculation
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId);

      const totalLessons = lessonsData?.length || 1;
      const progress = Math.round((completedLessons.length / totalLessons) * 100);

      // Update enrollment with new completed lesson and progress
      const { error: updateError } = await supabase
        .from("enrollments")
        .upsert({
          id: existingEnrollment?.id,
          user_id: session.user.id,
          course_id: courseId,
          completed_lessons: completedLessons,
          progress: progress,
        })
        .select()
        .single();

      if (updateError) {
        console.error("Error updating enrollment:", updateError);
        throw updateError;
      }

      // Invalidate queries to refresh data in real-time
      await queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      await queryClient.invalidateQueries({ queryKey: ["completedLessons", courseId] });

      onComplete();

      toast({
        title: "Progress saved",
        description: "Lesson marked as complete",
      });

    } catch (error) {
      console.error("Error in handleComplete:", error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (lessonId: string) => {
    navigate(`/dashboard/courses/${courseId}/lessons/${lessonId}`);
  };

  return {
    handleComplete,
    handleNavigation,
  };
};