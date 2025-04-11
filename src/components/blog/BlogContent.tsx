
interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg prose-pre:whitespace-pre-wrap prose-p:whitespace-normal prose-p:mb-6 prose-li:mb-2 mb-24"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
