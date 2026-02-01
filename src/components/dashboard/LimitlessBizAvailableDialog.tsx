import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const LIMITLESSBIZ_COURSE_ID = "e0ac8d90-bdba-4a50-a3bd-148c0903d43f";
const LIMITLESSBIZ_SLUG = "limitlessbiz-ai-for-msme-advancement";
const STORAGE_KEY = "limitlessbiz_announcement_seen";

interface CourseInfo {
  title: string;
  image_url: string | null;
}

export function LimitlessBizAvailableDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<CourseInfo | null>(null);

  useEffect(() => {
    const checkLimitlessBizEnrollment = async () => {
      // Check if user has already seen this announcement
      const hasSeenAnnouncement = localStorage.getItem(STORAGE_KEY);
      if (hasSeenAnnouncement) return;

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is enrolled in LimitlessBiz course
        const { data: enrollment, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', LIMITLESSBIZ_COURSE_ID)
          .maybeSingle();

        if (enrollmentError || !enrollment) return;

        // User is enrolled, fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('title, image_url')
          .eq('id', LIMITLESSBIZ_COURSE_ID)
          .maybeSingle();

        if (courseError || !courseData) return;

        setCourse(courseData);
        setOpen(true);
      } catch (err) {
        console.error('Error checking LimitlessBiz enrollment:', err);
      }
    };

    // Small delay to ensure dashboard has loaded
    const timer = setTimeout(checkLimitlessBizEnrollment, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToCourse = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
    navigate(`/dashboard/courses/${LIMITLESSBIZ_COURSE_ID}/lessons`);
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        localStorage.setItem(STORAGE_KEY, "true");
      }
      setOpen(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            🎉 Great News!
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            <span className="font-semibold text-foreground">{course.title}</span> is now available!
          </DialogDescription>
        </DialogHeader>
        
        {/* Course Image */}
        {course.image_url && (
          <div className="my-4 overflow-hidden rounded-lg border">
            <img
              src={course.image_url}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        <p className="text-center text-muted-foreground text-sm">
          You're enrolled and ready to start learning. Dive in and unlock new skills for your business!
        </p>
        
        <DialogFooter className="flex flex-col gap-2 sm:flex-col pt-4">
          <Button onClick={handleGoToCourse} className="w-full gap-2" size="lg">
            Go to Course
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={handleClose} className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
