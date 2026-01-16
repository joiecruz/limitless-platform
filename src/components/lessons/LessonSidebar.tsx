import { Link } from "react-router-dom";
import { ArrowLeft, Lock, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  release_date: string;
  section_id: string | null;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  sections: Section[];
  currentLessonId: string;
  courseId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LessonSidebar = ({
  lessons,
  sections,
  currentLessonId,
  courseId,
  isOpen,
  onOpenChange,
}: LessonSidebarProps) => {
  // Group lessons by section
  const getLessonsForSection = (sectionId: string) => {
    return lessons.filter((lesson) => lesson.section_id === sectionId);
  };

  const unsectionedLessons = lessons.filter((lesson) => !lesson.section_id);

  return (
    <div className="relative hidden md:block">
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
          <CollapsibleContent className="overflow-y-auto h-[calc(100vh-65px)]">
            {/* Render sections with their lessons */}
            {sections.map((section) => {
              const sectionLessons = getLessonsForSection(section.id);
              if (sectionLessons.length === 0) return null;

              return (
                <div key={section.id}>
                  {/* Section divider */}
                  <div className="px-4 py-3 bg-gray-100 border-y border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </span>
                  </div>
                  {/* Section lessons */}
                  {sectionLessons.map((lesson) => {
                    const isLocked = new Date(lesson.release_date) > new Date();
                    return (
                      <Link
                        key={lesson.id}
                        to={isLocked ? "#" : `/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-100 ${
                          lesson.id === currentLessonId
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50"
                        } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isLocked && <Lock className="w-4 h-4 flex-shrink-0" />}
                        <span className="flex-1">{lesson.title}</span>
                        {lesson.duration && (
                          <span className="text-xs text-gray-400">
                            {lesson.duration} mins
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}

            {/* Unsectioned lessons */}
            {unsectionedLessons.length > 0 && sections.length > 0 && (
              <div className="px-4 py-3 bg-gray-100 border-y border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Other Lessons
                </span>
              </div>
            )}
            {unsectionedLessons.map((lesson) => {
              const isLocked = new Date(lesson.release_date) > new Date();
              return (
                <Link
                  key={lesson.id}
                  to={isLocked ? "#" : `/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                  className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-100 ${
                    lesson.id === currentLessonId
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLocked && <Lock className="w-4 h-4 flex-shrink-0" />}
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
      {/* Fixed toggle button that stays visible - hidden on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className={`fixed top-4 transition-all duration-300 z-50 hidden md:flex ${
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
