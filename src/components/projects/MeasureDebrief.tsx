import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import React from 'react';

interface MeasureDebriefProps {
  // Add props for dynamic content if needed in the future
}

const MeasureDebrief: React.FC<MeasureDebriefProps> = () => {
  return (
    <Card className="flex-1 min-w-0 rounded-lg border shadow-sm minHeight-[500px]">
      <div className="p-6 h-full">
        <div className="mb-7">
          <div className="text-sm text-gray-500 ">Debrief & Reflections</div>
          <div className="font-semibold text-xl mt-2 text-gray-800" style={{ color: '#393CA0' }}>
            Project Retrospective
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-6">
              <span className="font-medium">
                What went well with this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          <div>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-6">
              <span className="font-medium">
                What went wrong with this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          <div>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-6">
              <span className="font-medium">
                What can be improved in this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Add Generate and Edit buttons below all content */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-6 py-2 bg-[#393CA0] text-white rounded-lg font-semibold hover:bg-[#393CA0]/90 transition-colors"
          >
            Generate
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MeasureDebrief;
