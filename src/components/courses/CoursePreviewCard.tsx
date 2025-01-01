import { BookOpen, Clock, Award } from "lucide-react";

interface CoursePreviewCardProps {
  title: string;
  lessonCount: number;
  duration: string;
  hasCertificate?: boolean;
  imageUrl?: string;
}

const CoursePreviewCard = ({
  title,
  lessonCount,
  duration,
  hasCertificate = true,
  imageUrl,
}: CoursePreviewCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <div className="aspect-video bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {title}
        </h3>
        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{lessonCount} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          {hasCertificate && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certificate</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewCard;