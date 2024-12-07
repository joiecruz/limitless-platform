import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";
import CourseEnrollment from "./CourseEnrollment";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lesson_count: number;
  enrollee_count: number;
}

interface CourseCardProps {
  course: Course;
  enrollment?: {
    course_id: string;
    progress: number;
  };
  onEnroll: () => void;
  isEnrolling: boolean;
}

const CourseCard = ({ course, enrollment, onEnroll, isEnrolling }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <img
          src={course.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'}
          alt={course.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lesson_count || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrollee_count || 0} enrolled</span>
          </div>
        </div>
        
        <CourseEnrollment
          courseId={course.id}
          courseTitle={course.title}
          isEnrolled={!!enrollment}
          progress={enrollment?.progress}
          onEnroll={onEnroll}
          isEnrolling={isEnrolling}
        />
      </CardContent>
    </Card>
  );
};

export default CourseCard;