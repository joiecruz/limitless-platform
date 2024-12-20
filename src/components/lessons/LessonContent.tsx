interface LessonContentProps {
  title: string;
  description: string | null;
  bodyContent: string | null;
  currentIndex: number;
  totalLessons: number;
}

const LessonContent = ({
  title,
  description,
  bodyContent,
  currentIndex,
  totalLessons,
}: LessonContentProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Lesson {currentIndex + 1} of {totalLessons}
        </div>
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <div className="prose max-w-none mt-4">
            <p className="text-gray-600">{description}</p>
          </div>
        )}
      </div>
      {bodyContent && (
        <article 
          className="prose prose-slate max-w-none mt-8 prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-primary-600 prose-strong:text-gray-900 prose-code:text-primary-600 prose-pre:bg-gray-900 prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: bodyContent }}
        />
      )}
    </div>
  );
};

export default LessonContent;