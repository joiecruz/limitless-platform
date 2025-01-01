import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  lessonCount: number;
  enrolleeCount: number;
}

export function CourseCard({ id, title, description, imageUrl, lessonCount, enrolleeCount }: CourseCardProps) {
  return (
    <Link to={`/courses/${id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:border-[#393CA0]/20">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-2 mb-4">{description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{lessonCount} lessons</span>
            <span>{enrolleeCount} enrolled</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}