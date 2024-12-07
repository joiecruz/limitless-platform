import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Lock, Maximize2, Settings, Cast } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const Lesson = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
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
        console.error("Error fetching lesson:", error);
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
        console.error("Error fetching lessons:", error);
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

      // Update enrollment progress
      const { error: enrollmentError } = await supabase
        .from("enrollments")
        .upsert({
          user_id: session.user.id,
          course_id: courseId,
          progress: Math.round(((currentIndex + 1) / totalLessons) * 100),
        });

      if (enrollmentError) {
        throw enrollmentError;
      }

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

  if (lessonLoading) {
    return <div>Loading...</div>;
  }

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
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
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="space-y-1">
            {lessons.map((l) => {
              const isLocked = new Date(l.release_date) > new Date();
              return (
                <Link
                  key={l.id}
                  to={isLocked ? "#" : `/courses/${courseId}/lessons/${l.id}`}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    l.id === lessonId
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4 flex-shrink-0" />
                  ) : null}
                  <span className="flex-1">{l.title}</span>
                  {l.duration && (
                    <span className="text-xs text-gray-400">
                      {l.duration} mins
                    </span>
                  )}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">
                Lesson {currentIndex + 1} of {totalLessons}
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {lesson.title}
              </h1>
            </div>

            {/* Video player */}
            {lesson.video_url && (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
                <video
                  src={lesson.video_url}
                  controls
                  className="absolute inset-0 w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70">
                    <Cast className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Description */}
            {lesson.description && (
              <div className="prose max-w-none mb-8">
                <p className="text-gray-600">{lesson.description}</p>
              </div>
            )}

            {/* Navigation */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;