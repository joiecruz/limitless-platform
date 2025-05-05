
import React from 'react';
import VideoPlayer from './VideoPlayer';
import LessonBodyContent from './LessonBodyContent';

interface LessonContentProps {
  videoUrl?: string | null;
  bodyContent?: string | null;
}

const LessonContent = ({ videoUrl, bodyContent }: LessonContentProps) => {
  return (
    <>
      {videoUrl && (
        <div className="px-6 mb-4">
          <VideoPlayer videoUrl={videoUrl} />
        </div>
      )}
      <LessonBodyContent content={bodyContent} />
    </>
  );
};

export default LessonContent;
