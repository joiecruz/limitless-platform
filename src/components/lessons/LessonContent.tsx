interface LessonContentProps {
  title: string;
  description: string | null;
  currentIndex: number;
  totalLessons: number;
}

const LessonContent = ({
  title,
  description,
  currentIndex,
  totalLessons,
}: LessonContentProps) => {
  return (
    <div className="mb-8">
      <div className="text-sm text-gray-500 mb-2">
        Lesson {currentIndex + 1} of {totalLessons}
      </div>
      <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
      {description && (
        <div className="prose max-w-none mb-8">
          <p className="text-gray-600">{description}</p>
        </div>
      )}
    </div>
  );
};

export default LessonContent;