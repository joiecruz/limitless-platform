import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LessonNavigationProps {
  previousLesson: { id: string } | undefined;
  nextLesson: { id: string } | undefined;
  courseId: string;
  onComplete: () => void;
  isCompleted?: boolean;
}

const LessonNavigation = ({
  previousLesson,
  nextLesson,
  courseId,
  onComplete,
  isCompleted = false,
}: LessonNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pt-8 border-t">
      <div className="flex items-center">
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
      <div className="flex items-center gap-4">
        <Button onClick={onComplete}>
          {isCompleted && nextLesson ? "Next Lesson" : "Complete Lesson"}
          {nextLesson && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default LessonNavigation;