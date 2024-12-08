import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseProgress from "./CourseProgress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

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

  const handleEnroll = async () => {
    console.log('Starting enrollment process');
    try {
      // Create enrollment in database
      await onEnroll();
      console.log('Enrollment successful');
      
      // Show success toast
      toast({
        title: "Successfully enrolled!",
        description: `You are now enrolled in ${courseTitle || "this course"}`,
      });
    } catch (error) {
      console.error('Error enrolling:', error);
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
        <Link to={`/courses/${courseId}/lessons`} className="block w-full">
          <Button className="w-full">
            {progress === 0 ? "Start Learning" : "Continue Learning"}
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Button 
      className="w-full"
      onClick={handleEnroll}
      disabled={isEnrolling}
    >
      {isEnrolling ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
};

export default CourseEnrollment;