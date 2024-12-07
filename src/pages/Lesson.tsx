import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronRight, Menu, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

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

      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  // Fetch course lessons for navigation
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order");

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Fetch current user's enrollment
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !courseId) return null;

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Update progress mutation
  const updateProgress = useMutation({
    mutationFn: async () => {
      if (!enrollment) throw new Error("Not enrolled in course");
      
      const completedLessons = lessons.findIndex(l => l.id === lessonId) + 1;
      const totalLessons = lessons.length;
      const newProgress = Math.round((completedLessons / totalLessons) * 100);

      const { error } = await supabase
        .from("enrollments")
        .update({ progress: newProgress })
        .eq("id", enrollment.id);

      if (error) throw error;
      return newProgress;
    },
    onSuccess: (newProgress) => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      toast({
        title: "Progress Updated",
        description: `Your progress has been updated to ${newProgress}%`,
      });

      // Navigate to next lesson if available
      const currentIndex = lessons.findIndex(l => l.id === lessonId);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson) {
        navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
      } else {
        navigate(`/courses/${courseId}/lessons`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating progress:", error);
    },
  });

  if (lessonLoading) {
    return <div>Loading...</div>;
  }

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const currentLessonIndex = lessons.findIndex(l => l.id === lessonId);
  const totalLessons = lessons.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="lg:w-80 border-r border-gray-200 min-h-screen bg-gray-50 fixed lg:relative z-50"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/courses/${courseId}/lessons`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Lessons
            </Button>
            <CollapsibleTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="h-[calc(100vh-64px)] overflow-y-auto">
            <div className="space-y-1 p-2">
              {lessons.map((l, index) => (
                <Button
                  key={l.id}
                  variant={l.id === lessonId ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => navigate(`/courses/${courseId}/lessons/${l.id}`)}
                >
                  <PlayCircle className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{l.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {l.duration} mins
                    </div>
                  </div>
                  {l.id === lessonId && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Main content */}
        <div className="flex-1 min-h-screen overflow-y-auto">
          <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {totalLessons}
              </div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
            </div>

            {/* Video player */}
            {lesson.video_url && (
              <div className="aspect-video bg-gray-950 rounded-lg overflow-hidden">
                <video
                  src={lesson.video_url}
                  controls
                  className="w-full h-full"
                  poster="/lovable-uploads/28d64e6d-2abf-4c0b-b5a0-c1d007a0c58c.png"
                />
              </div>
            )}

            {/* Lesson description */}
            <div className="prose max-w-none">
              <p>{lesson.description}</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const prevLesson = lessons[currentLessonIndex - 1];
                  if (prevLesson) {
                    navigate(`/courses/${courseId}/lessons/${prevLesson.id}`);
                  }
                }}
                disabled={currentLessonIndex === 0}
              >
                Previous Lesson
              </Button>
              <Button
                onClick={() => updateProgress.mutate()}
                disabled={updateProgress.isPending}
                className="gap-2"
              >
                Complete Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;