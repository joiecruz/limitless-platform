import { BookOpen, Users } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseDetailsProps {
  title: string;
  description: string;
  lessonCount: number;
  enrolleeCount: number;
  isEnrolled: boolean;
  isLocked: boolean;
}

const CourseDetails = ({ 
  title, 
  description, 
  lessonCount, 
  enrolleeCount,
  isEnrolled,
  isLocked
}: CourseDetailsProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="leading-[1.2]">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      {!isEnrolled && !isLocked && (
        <div className="px-6 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessonCount || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{enrolleeCount || 0} enrolled</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetails;