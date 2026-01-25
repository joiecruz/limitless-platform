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
import { GraduationCap, ArrowRight } from "lucide-react";

interface CourseInfo {
  id: string;
  title: string;
  slug: string;
}

export function CourseAccessGrantedDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<CourseInfo | null>(null);

  useEffect(() => {
    const checkGrantedCourseAccess = async () => {
      // Check if there's a recently granted course access stored
      const grantedCourseId = localStorage.getItem('granted_course_access');
      
      if (!grantedCourseId) return;

      // Clear the flag immediately to prevent showing again
      localStorage.removeItem('granted_course_access');

      try {
        // Fetch course details
        const { data: courseData, error } = await supabase
          .from('courses')
          .select('id, title, slug')
          .eq('id', grantedCourseId)
          .maybeSingle();

        if (error || !courseData) {
          console.error('Error fetching course details:', error);
          return;
        }

        setCourse(courseData);
        setOpen(true);
      } catch (err) {
        console.error('Error checking granted course access:', err);
      }
    };

    // Small delay to ensure dashboard has loaded
    const timer = setTimeout(checkGrantedCourseAccess, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToCourse = () => {
    setOpen(false);
    if (course) {
      navigate(`/dashboard/courses/${course.slug}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Course Access Granted!</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You have been granted access to <span className="font-semibold text-foreground">{course.title}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col pt-4">
          <Button onClick={handleGoToCourse} className="w-full gap-2">
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
