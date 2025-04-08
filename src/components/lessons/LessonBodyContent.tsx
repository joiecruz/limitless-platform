
interface LessonBodyContentProps {
  content: string | null;
}

const LessonBodyContent = ({ content }: LessonBodyContentProps) => {
  if (!content) return null;

  return (
    <article 
      className="prose prose-slate max-w-none mt-8 prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-primary-600 prose-strong:text-gray-900 prose-code:text-primary-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-p:whitespace-pre-wrap prose-p:mb-4"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default LessonBodyContent;
