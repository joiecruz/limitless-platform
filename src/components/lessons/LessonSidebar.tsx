import { Link } from "react-router-dom";
import { ArrowLeft, Lock, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  release_date: string;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  courseId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LessonSidebar = ({
  lessons,
  currentLessonId,
  courseId,
  isOpen,
  onOpenChange,
}: LessonSidebarProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-80 bg-white border-r min-h-screen flex-shrink-0 transition-all duration-300"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Link
            to={`/courses/${courseId}/lessons`}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Lessons
          </Link>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              {isOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="space-y-1">
        {lessons.map((lesson) => {
          const isLocked = new Date(lesson.release_date) > new Date();
          return (
            <Link
              key={lesson.id}
              to={isLocked ? "#" : `/courses/${courseId}/lessons/${lesson.id}`}
              className={`flex items-center gap-3 px-4 py-3 text-sm ${
                lesson.id === currentLessonId
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {isLocked ? <Lock className="w-4 h-4 flex-shrink-0" /> : null}
              <span className="flex-1">{lesson.title}</span>
              {lesson.duration && (
                <span className="text-xs text-gray-400">
                  {lesson.duration} mins
                </span>
              )}
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LessonSidebar;