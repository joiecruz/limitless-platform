import { BookOpen, Users } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseDetailsProps {
  title: string;
  description: string;
  lessonCount: number;
  enrolleeCount: number;
  isEnrolled: boolean;
  isLocked: boolean;
  format?: string;
}

const CourseDetails = ({ 
  title, 
  description, 
  lessonCount, 
  enrolleeCount,
  isEnrolled,
  isLocked,
  format = 'Online'
}: CourseDetailsProps) => {
  // Helper function to get badge color based on format
  const getBadgeColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'online':
        return 'bg-blue-50 text-blue-600';
      case 'hybrid':
        return 'bg-purple-50 text-purple-600';
      case 'in-person':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <>
      <CardHeader>
        {format && (
          <div className="flex items-center gap-1 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(format)}`}>
              {format}
            </span>
          </div>
        )}
        <CardTitle className="leading-[1.2]">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      {!isEnrolled && !isLocked && (
        <div className="px-6 pb-4 flex items-center gap-4 text-sm text-muted-foreground">
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