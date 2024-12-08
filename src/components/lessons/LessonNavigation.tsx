import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LessonNavigationProps {
  previousLesson: { id: string } | undefined;
  nextLesson: { id: string } | undefined;
  courseId: string;
  onComplete: () => void;
}

const LessonNavigation = ({
  previousLesson,
  nextLesson,
  courseId,
  onComplete,
}: LessonNavigationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("completed_lessons")
        .eq("user_id", session.user.id)
        .eq("course_id", courseId)
        .single();

      // Get all completed lessons or initialize empty array
      const completedLessons = existingEnrollment?.completed_lessons || [];

      // Add current lesson if not already completed
      if (!completedLessons.includes(currentLessonId)) {
        completedLessons.push(currentLessonId);
      }

      // Update enrollment with new completed lesson
      const { error: updateError } = await supabase
        .from("enrollments")
        .upsert({
          user_id: session.user.id,
          course_id: courseId,
          completed_lessons: completedLessons,
        });

      if (updateError) throw updateError;

      // Call the original onComplete handler
      onComplete();

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

  return (
    <div className="flex items-center justify-between pt-8 border-t">
      <div>
        {previousLesson && (
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/courses/${courseId}/lessons/${previousLesson.id}`)
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Lesson
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={handleComplete}>
          Complete Lesson
          {nextLesson && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default LessonNavigation;