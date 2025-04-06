
interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg prose-pre:whitespace-pre-wrap prose-p:whitespace-pre-line prose-img:mx-auto mb-24"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
