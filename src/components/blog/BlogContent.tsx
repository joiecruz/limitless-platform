import { SafeHTML } from '@/components/common/SafeHTML';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <SafeHTML
      html={content}
      className="blog-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4 prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg prose-pre:whitespace-pre-wrap prose-li:mb-2 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:font-semibold mb-24"
    />
  );
}
