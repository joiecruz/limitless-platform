import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import CourseProgress from "./CourseProgress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

  console.log('Dialog state:', { showDialog, isEnrolling });

  const handleEnroll = async () => {
    console.log('Starting enrollment process');
    try {
      await onEnroll();
      console.log('Enrollment successful, showing dialog');
      setShowDialog(true);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const handleDialogAction = () => {
    console.log('Dialog action clicked, navigating to lessons');
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

      <Dialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
      >
        <DialogContent className="max-w-md aspect-square flex flex-col">
          <DialogHeader className="flex-grow flex flex-col items-center justify-center text-center px-6">
            <DialogTitle className="text-2xl mb-2">Congratulations! 🎉</DialogTitle>
            <DialogDescription className="text-lg">
              You are now enrolled in {courseTitle || "this course"}. Ready to start learning?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              className="w-full"
              onClick={handleDialogAction}
            >
              Let's Begin!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseEnrollment;