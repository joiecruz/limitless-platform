
import { PortableText } from '@portabletext/react';

interface BlogContentProps {
  content: any;
}

// Custom components for rendering Sanity's Portable Text
const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="my-8">
          <img
            src={`https://cdn.sanity.io/images/your-project-id/production/${value.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`}
            alt={value.alt || 'Blog image'}
            className="rounded-lg mx-auto"
          />
          {value.caption && (
            <div className="text-center text-sm text-gray-500 mt-2">{value.caption}</div>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-primary-600 hover:underline">
          {children}
        </a>
      );
    },
  },
};

export function BlogContent({ content }: BlogContentProps) {
  // Handle both Sanity Portable Text and HTML string (for backward compatibility)
  if (typeof content === 'string') {
    return (
      <div 
        className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg mb-24"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  
  // Render Sanity Portable Text
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg mb-24">
      <PortableText value={content} components={components} />
    </div>
  );
}
