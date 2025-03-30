import { PortableText } from '@portabletext/react';

interface CaseStudyContentProps {
  problem?: any;
  approach?: any;
  impact?: any;
}

// Custom components for rendering Sanity's Portable Text
const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="my-8">
          <img
            src={`https://cdn.sanity.io/images/your-project-id/production/${value.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`}
            alt={value.alt || 'Case study image'}
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

export function CaseStudyContent({ problem, approach, impact }: CaseStudyContentProps) {
  // Helper function to render content based on type
  const renderContent = (content: any) => {
    if (!content) return null;
    
    // If content is a string (HTML), use dangerouslySetInnerHTML
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    // Otherwise, render as Portable Text
    return <PortableText value={content} components={components} />;
  };

  return (
    <div className="max-w-7xl mx-auto py-24">
      <div className="space-y-24">
        {problem && (
          <div>
            <h2 className="text-4xl font-bold text-[#393CA0] mb-8">The opportunity</h2>
            <div className="text-gray-600 text-lg leading-relaxed max-w-3xl prose prose-lg">
              {renderContent(problem)}
            </div>
          </div>
        )}

        {approach && (
          <div>
            <h2 className="text-4xl font-bold text-[#393CA0] mb-8">Our approach</h2>
            <div className="text-gray-600 text-lg leading-relaxed max-w-3xl prose prose-lg">
              {renderContent(approach)}
            </div>
          </div>
        )}

        {impact && (
          <div>
            <h2 className="text-4xl font-bold text-[#393CA0] mb-8">Impact</h2>
            <div className="text-gray-600 text-lg leading-relaxed max-w-3xl prose prose-lg">
              {renderContent(impact)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
