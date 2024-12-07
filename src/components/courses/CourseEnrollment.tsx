import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseProgress from "./CourseProgress";

interface CourseEnrollmentProps {
  courseId: string;
  isEnrolled: boolean;
  progress?: number;
  onEnroll: () => void;
  isEnrolling: boolean;
}

const CourseEnrollment = ({ 
  courseId, 
  isEnrolled, 
  progress = 0, 
  onEnroll, 
  isEnrolling 
}: CourseEnrollmentProps) => {
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
      onClick={onEnroll}
      disabled={isEnrolling}
    >
      {isEnrolling ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
};

export default CourseEnrollment;