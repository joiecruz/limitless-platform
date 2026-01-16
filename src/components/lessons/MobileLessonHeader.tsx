import { Link } from "react-router-dom";
import { Menu, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  release_date: string;
}

interface MobileLessonHeaderProps {
  lessons: Lesson[];
  currentLessonId: string;
  courseId: string;
  currentIndex: number;
  totalLessons: number;
  lessonTitle: string;
}

const MobileLessonHeader = ({
  lessons,
  currentLessonId,
  courseId,
  currentIndex,
  totalLessons,
  lessonTitle,
}: MobileLessonHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 bg-background border-b md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/dashboard/courses/${courseId}/lessons`}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Lessons
                  </Link>
                </div>
                <SheetTitle className="text-left mt-2">Lessons</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-[calc(100vh-120px)]">
                {lessons.map((lesson) => {
                  const isLocked = new Date(lesson.release_date) > new Date();
                  return (
                    <Link
                      key={lesson.id}
                      to={isLocked ? "#" : `/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                      onClick={() => !isLocked && setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm border-b ${
                        lesson.id === currentLessonId
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLocked && <Lock className="w-4 h-4 flex-shrink-0" />}
                      <span className="flex-1 line-clamp-2">{lesson.title}</span>
                      {lesson.duration && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {lesson.duration}m
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">
              Lesson {currentIndex + 1} of {totalLessons}
            </p>
            <h1 className="text-sm font-medium truncate">{lessonTitle}</h1>
          </div>
        </div>
        <Link
          to={`/dashboard/courses/${courseId}/lessons`}
          className="shrink-0"
        >
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileLessonHeader;
