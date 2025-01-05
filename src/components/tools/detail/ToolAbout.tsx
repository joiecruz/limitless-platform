interface ToolAboutProps {
  description: string;
  category: string;
  use_case_1: string;
  use_case_2: string;
  use_case_3: string;
}

export function ToolAbout({ description, category, use_case_1, use_case_2, use_case_3 }: ToolAboutProps) {
  return (
    <div className="bg-[#393CA0] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About the tool</h2>
            <span className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm">
              {category}
            </span>
          </div>
          <div className="space-y-8">
            <p className="text-lg leading-relaxed">{description}</p>
            <div className="space-y-4">
              <h3 className="font-medium">Used for:</h3>
              <ul className="space-y-3">
                {use_case_1 && (
                  <li className="flex items-center gap-3">
                    <span className="text-[#FFD700]">✱</span>
                    {use_case_1}
                  </li>
                )}
                {use_case_2 && (
                  <li className="flex items-center gap-3">
                    <span className="text-[#FFD700]">✱</span>
                    {use_case_2}
                  </li>
                )}
                {use_case_3 && (
                  <li className="flex items-center gap-3">
                    <span className="text-[#FFD700]">✱</span>
                    {use_case_3}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}