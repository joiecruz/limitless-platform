import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseProgress from "./CourseProgress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CourseEnrollmentProps {
  courseId: string;
  courseTitle?: string;
  isEnrolled: boolean;
  progress?: number;
  onEnroll: () => void;
  isEnrolling: boolean;
}

const CourseEnrollment = ({
  courseId,
  courseTitle,
  isEnrolled,
  progress = 0,
  onEnroll,
  isEnrolling
}: CourseEnrollmentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEnroll = async () => {
    
    try {
      await onEnroll();
      

      // Invalidate course counts to update enrollment numbers immediately
      queryClient.invalidateQueries({ queryKey: ["course-counts", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["featured-courses"] });

      toast({
        title: "Successfully enrolled!",
        description: `You are now enrolled in ${courseTitle || "this course"}`,
      });
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEnrolled) {
    return (
      <div className="space-y-4">
        <CourseProgress progress={progress} />
        <Link to={`/dashboard/courses/${courseId}/lessons`} className="block w-full">
          <Button className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90">
            {progress === 0 ? "Start Learning" : "Continue Learning"}
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Button
      className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90"
      onClick={handleEnroll}
      disabled={isEnrolling}
    >
      {isEnrolling ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
};

export default CourseEnrollment;