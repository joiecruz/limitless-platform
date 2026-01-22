import { SafeHTML } from '@/components/common/SafeHTML';

interface LessonBodyContentProps {
  content: string | null;
}

const LessonBodyContent = ({ content }: LessonBodyContentProps) => {
  if (!content) return null;

  // Auto-link plain URLs that aren't already inside anchor tags
  const autoLinkUrls = (text: string): string => {
    // Match URLs not already wrapped in anchor tags
    const urlRegex = /(?<!href=["'])(https?:\/\/[^\s<>"]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">$1</a>');
  };

  // Replace empty <p></p> tags with spacer divs to preserve intentional spacing
  const processedContent = autoLinkUrls(content)
    .replace(/<p><\/p>/g, '<div style="height: 1rem;"></div>')
    .replace(/<p>\s*<\/p>/g, '<div style="height: 1rem;"></div>');

  return (
    <div className="px-4 md:px-6">
      <SafeHTML
        html={processedContent}
        as="article"
        className="prose prose-slate max-w-none mt-6 md:mt-8 prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-strong:text-gray-900 prose-code:text-primary-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-p:whitespace-pre-wrap prose-p:mb-4 md:prose-p:mb-6 prose-li:mb-2 prose-img:rounded-lg prose-ul:my-2 prose-li:my-1"
      />
    </div>
  );
};

export default LessonBodyContent;
