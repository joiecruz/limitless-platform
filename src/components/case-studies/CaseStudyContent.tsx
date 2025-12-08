import { SafeHTML } from '@/components/common/SafeHTML';

interface CaseStudyContentProps {
  problem?: string;
  approach?: string;
  impact?: string;
}

export function CaseStudyContent({ problem, approach, impact }: CaseStudyContentProps) {
  return (
    <div className="max-w-7xl mx-auto py-24">
      <div className="space-y-24">
        {problem && (
          <div>
            <h2 className="text-4xl font-bold text-[#393CA0] mb-8">The opportunity</h2>
            <SafeHTML
              html={problem}
              className="text-gray-600 text-lg leading-relaxed max-w-3xl prose prose-lg"
            />
          </div>
        )}

        {approach && (
          <div>
            <h2 className="text-4xl font-bold text-[#393CA0] mb-8">Our approach</h2>
            <SafeHTML
              html={approach}
              className="text-gray-600 text-lg leading-relaxed max-w-3xl prose prose-lg"
            />
          </div>
        )}

        {impact && (
          <div>
            <h2 className="text-4xl font-bold text-[#393CA0] mb-8">Impact</h2>
            <SafeHTML
              html={impact}
              className="text-gray-600 text-lg leading-relaxed max-w-3xl prose prose-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
