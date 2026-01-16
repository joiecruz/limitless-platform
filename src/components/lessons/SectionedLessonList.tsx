import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Video, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  release_date: string;
  order: number;
  duration: number | null;
  section_id: string | null;
}

interface CourseSection {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
}

interface SectionedLessonListProps {
  lessons: Lesson[];
  courseId: string;
}

const SectionedLessonList: React.FC<SectionedLessonListProps> = ({ lessons, courseId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch sections
  const { data: sections = [] } = useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_sections")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (error) throw error;
      return data as CourseSection[];
    },
  });

  // Fetch completed lessons for the current user
  const { data: completedLessons = [] } = useQuery({
    queryKey: ["completedLessons", courseId],
    queryFn: async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) return [];

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("completed_lessons")
        .eq("course_id", courseId)
        .eq("user_id", userSession.session.user.id)
        .single();

      return enrollment?.completed_lessons || [];
    },
  });

  const isReleaseDateLocked = (releaseDate: string) => {
    return new Date(releaseDate) > new Date();
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  // Get all lessons sorted by order for ladderized progression
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  // Check if a lesson is locked based on ladderized progression
  const isLessonLocked = (lesson: Lesson) => {
    // First check release date
    if (isReleaseDateLocked(lesson.release_date)) {
      return { locked: true, reason: 'release_date', releaseDate: lesson.release_date };
    }
    
    // First lesson is always unlocked (if release date has passed)
    const lessonIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
    if (lessonIndex === 0) {
      return { locked: false, reason: null };
    }
    
    // Check if all previous lessons are completed
    for (let i = 0; i < lessonIndex; i++) {
      if (!isLessonCompleted(sortedLessons[i].id)) {
        return { locked: true, reason: 'progression', previousLesson: sortedLessons[i].title };
      }
    }
    
    return { locked: false, reason: null };
  };

  const handleLessonClick = (lesson: Lesson) => {
    const lockStatus = isLessonLocked(lesson);
    
    if (lockStatus.locked) {
      if (lockStatus.reason === 'release_date') {
        toast({
          title: "Lesson Locked",
          description: `This lesson will be available on ${format(
            new Date(lockStatus.releaseDate!),
            "MMMM dd, yyyy"
          )}`,
        });
      } else {
        toast({
          title: "Complete Previous Lesson",
          description: `Please complete "${lockStatus.previousLesson}" first to unlock this lesson.`,
        });
      }
      return;
    }

    navigate(`/dashboard/courses/${courseId}/lessons/${lesson.id}`);
  };

  // Group lessons by section
  const unsectionedLessons = lessons.filter((l) => !l.section_id);
  const sectionedLessons = sections.map((section) => ({
    ...section,
    lessons: lessons.filter((l) => l.section_id === section.id).sort((a, b) => a.order - b.order),
  }));

  const renderLessonItem = (lesson: Lesson) => {
    const lockStatus = isLessonLocked(lesson);
    const locked = lockStatus.locked;
    const completed = isLessonCompleted(lesson.id);

    return (
      <button
        key={lesson.id}
        onClick={() => handleLessonClick(lesson)}
        disabled={locked}
        className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
          locked
            ? "bg-muted/50 cursor-not-allowed opacity-60"
            : completed
            ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
            : "bg-card hover:bg-accent/50 hover:border-accent"
        }`}
      >
        <div className="flex-shrink-0">
          {locked ? (
            <Lock className="w-5 h-5 text-muted-foreground" />
          ) : completed ? (
            <CheckCircle className="w-5 h-5 text-primary" />
          ) : (
            <Video className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1 text-left">
          <div
            className={`font-medium ${
              locked ? "text-muted-foreground" : completed ? "text-primary" : "text-foreground"
            }`}
          >
            {lesson.title}
          </div>
          {lesson.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {lesson.description}
            </p>
          )}
        </div>
        {lesson.duration && (
          <div className="text-sm text-muted-foreground">
            {lesson.duration} min
          </div>
        )}
      </button>
    );
  };

  // If no sections exist, render flat list
  if (sections.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Course content</h2>
        <div className="space-y-2">
          {lessons.map(renderLessonItem)}
        </div>
      </div>
    );
  }

  // Render sectioned layout
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Course content</h2>
      
      <Accordion type="multiple" defaultValue={sections.map((s) => s.id)} className="space-y-3">
        {sectionedLessons.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border rounded-xl bg-card shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-accent/30 transition-colors">
              <div className="text-left">
                <div className="text-lg font-semibold text-foreground">{section.title}</div>
                {section.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                  {section.lessons.length > 0 && (
                    <> • {section.lessons.filter((l) => isLessonCompleted(l.id)).length} completed</>
                  )}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 pt-2">
                {section.lessons.length > 0 ? (
                  section.lessons.map(renderLessonItem)
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No lessons in this section yet
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Unsectioned lessons */}
      {unsectionedLessons.length > 0 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-medium text-muted-foreground px-1">Other Lessons</h3>
          {unsectionedLessons.map(renderLessonItem)}
        </div>
      )}
    </div>
  );
};

export default SectionedLessonList;
