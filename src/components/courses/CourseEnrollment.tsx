import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import CourseProgress from "./CourseProgress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

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
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      await onEnroll();
      setShowDialog(true);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const handleDialogAction = () => {
    setShowDialog(false);
    navigate(`/courses/${courseId}/lessons`);
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
    <>
      <Button 
        className="w-full"
        onClick={handleEnroll}
        disabled={isEnrolling}
      >
        {isEnrolling ? "Enrolling..." : "Enroll Now"}
      </Button>

      <AlertDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
      >
        <AlertDialogContent 
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations! 🎉</AlertDialogTitle>
            <AlertDialogDescription>
              You are now enrolled in {courseTitle || "this course"}. Ready to start learning?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogAction}>
              Let's Begin!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CourseEnrollment;