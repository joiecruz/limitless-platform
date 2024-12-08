import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import CourseProgress from "./CourseProgress";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
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

      // Navigate to lessons page
      navigate(`/courses/${courseId}/lessons`);
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
          <Button className="w-full">Continue Learning</Button>
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