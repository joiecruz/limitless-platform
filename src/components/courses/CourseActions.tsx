import { Lock } from "lucide-react";
import CourseEnrollment from "./CourseEnrollment";

interface CourseActionsProps {
  courseId: string;
  courseTitle: string;
  isLocked: boolean;
  isEnrolled: boolean;
  progress?: number;
  onEnroll: () => void;
  isEnrolling: boolean;
}

const CourseActions = ({ 
  courseId, 
  courseTitle, 
  isLocked, 
  isEnrolled, 
  progress, 
  onEnroll, 
  isEnrolling 
}: CourseActionsProps) => {
  if (isLocked) {
    return (
      <button 
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
        disabled
      >
        <Lock className="h-4 w-4" />
        Coming Soon
      </button>
    );
  }

  return (
    <CourseEnrollment
      courseId={courseId}
      courseTitle={courseTitle}
      isEnrolled={isEnrolled}
      progress={progress}
      onEnroll={onEnroll}
      isEnrolling={isEnrolling}
    />
  );
};

export default CourseActions;