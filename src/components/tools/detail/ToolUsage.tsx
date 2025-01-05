interface ToolUsageProps {
  how_to_use: string;
  when_to_use: string;
}

export function ToolUsage({ how_to_use, when_to_use }: ToolUsageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="space-y-24">
        <div>
          <h2 className="text-4xl font-bold text-[#393CA0] mb-8">How to use</h2>
          <div 
            className="text-gray-600 text-lg leading-relaxed max-w-3xl prose"
            dangerouslySetInnerHTML={{ __html: how_to_use || '' }}
          />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-[#393CA0] mb-8">When to use</h2>
          <div 
            className="text-gray-600 text-lg leading-relaxed max-w-3xl prose"
            dangerouslySetInnerHTML={{ __html: when_to_use || '' }}
          />
        </div>
      </div>
    </div>
  );
}