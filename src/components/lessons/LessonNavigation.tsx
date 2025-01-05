import { useNavigationHandlers } from "./navigation/useNavigationHandlers";
import { NavigationButton } from "./navigation/NavigationButton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  const { handleComplete, handleNavigation } = useNavigationHandlers(courseId, onComplete);

  return (
    <div className="flex items-center justify-between pt-8 border-t">
      <div>
        {previousLesson && (
          <NavigationButton
            direction="previous"
            onClick={() => handleNavigation(previousLesson.id)}
          />
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