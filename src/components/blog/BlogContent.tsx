import { PortableText } from '@portabletext/react';

interface BlogContentProps {
  content: string | any[];
  contentType?: 'html' | 'portable-text';
}

export function BlogContent({ content, contentType = 'html' }: BlogContentProps) {
  if (contentType === 'portable-text') {
    return (
      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg mb-24">
        <PortableText value={content} />
      </div>
    );
  }

  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg mb-24"
      dangerouslySetInnerHTML={{ __html: content as string }}
    />
  );
}
