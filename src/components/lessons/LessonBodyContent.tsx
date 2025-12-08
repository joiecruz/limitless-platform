import { SafeHTML } from '@/components/common/SafeHTML';

interface LessonBodyContentProps {
  content: string | null;
}

const LessonBodyContent = ({ content }: LessonBodyContentProps) => {
  if (!content) return null;

  return (
    <SafeHTML
      html={content}
      as="article"
      className="prose prose-slate max-w-none mt-8 prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-primary-600 prose-strong:text-gray-900 prose-code:text-primary-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-p:whitespace-pre-wrap prose-p:mb-6 prose-li:mb-2 prose-img:rounded-lg"
    />
  );
};

export default LessonBodyContent;
