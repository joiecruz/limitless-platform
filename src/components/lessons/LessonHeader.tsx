import React from 'react';

interface LessonHeaderProps {
  title: string;
  description?: string;
  currentIndex: number;
  totalLessons: number;
}

const LessonHeader = ({ title, description, currentIndex, totalLessons }: LessonHeaderProps) => {
  return (
    <div className="mb-8 px-6">
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
  );
};

export default LessonHeader;