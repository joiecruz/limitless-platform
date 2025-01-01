interface ToolAboutProps {
  description: string;
}

export function ToolAbout({ description }: ToolAboutProps) {
  return (
    <div className="bg-[#393CA0] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">About the template</h2>
            <span className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm">
              Evaluation and Feedback
            </span>
          </div>
          <div className="space-y-8">
            <p className="text-lg leading-relaxed">{description}</p>
            <div className="space-y-4">
              <h3 className="font-medium">Used for:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-[#FFD700]">✱</span>
                  Testing and refining user interfaces and interactions
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FFD700]">✱</span>
                  Gathering feedback on mobile app functionality and design
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#FFD700]">✱</span>
                  Validating concepts and features before full-scale development
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}