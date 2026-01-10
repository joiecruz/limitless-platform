import React from 'react';
import VideoPlayer from './VideoPlayer';
import LessonBodyContent from './LessonBodyContent';
import LessonSections from './LessonSections';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface LessonContentProps {
  videoUrl?: string | null;
  bodyContent?: string | null;
  sections?: Section[] | null;
}

const LessonContent = ({ videoUrl, bodyContent, sections }: LessonContentProps) => {
  // Parse sections if it's a string (from JSON storage)
  const parsedSections = React.useMemo(() => {
    if (!sections) return [];
    if (Array.isArray(sections)) return sections;
    try {
      return JSON.parse(sections as unknown as string);
    } catch {
      return [];
    }
  }, [sections]);

  return (
    <>
      {videoUrl && (
        <div className="px-6">
          <VideoPlayer videoUrl={videoUrl} />
        </div>
      )}
      <LessonBodyContent content={bodyContent} />
      <LessonSections sections={parsedSections} />
    </>
  );
};

export default LessonContent;