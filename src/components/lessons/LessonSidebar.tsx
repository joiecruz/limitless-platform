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
    <div className="relative">
      <div
        className={`fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-80"
        }`}
      >
        <Collapsible
          open={isOpen}
          onOpenChange={onOpenChange}
          className="w-80 bg-white border-r min-h-screen flex-shrink-0"
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Link
                to={`/dashboard/courses/${courseId}/lessons`}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lessons
              </Link>
            </div>
          </div>
          <CollapsibleContent className="space-y-1">
            {lessons.map((lesson) => {
              const isLocked = new Date(lesson.release_date) > new Date();
              return (
                <Link
                  key={lesson.id}
                  to={isLocked ? "#" : `/dashboard/courses/${courseId}/lessons/${lesson.id}`}
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
      </div>
      {/* Fixed toggle button that stays visible */}
      <Button
        variant="ghost"
        size="icon"
        className={`fixed top-4 transition-all duration-300 z-50 ${
          isOpen ? "left-72" : "left-4"
        }`}
        onClick={() => onOpenChange(!isOpen)}
      >
        {isOpen ? (
          <PanelLeftClose className="w-4 h-4" />
        ) : (
          <PanelLeft className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default LessonSidebar;