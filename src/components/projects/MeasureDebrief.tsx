import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import React from 'react';

interface MeasureDebriefProps {
  // Add props for dynamic content if needed in the future
}

const MeasureDebrief: React.FC<MeasureDebriefProps> = () => {
  return (
    <Card className="col-span-12 md:col-span-8 rounded-lg border shadow-sm h-full">
      <div className="p-6 h-full">
        <div className="mb-6">
          <div className="text-sm text-gray-500">Debrief & Reflections</div>
          <div className="font-semibold text-gray-800">
            Project Retrospective
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="font-medium">
                What went well with this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          <div>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="font-medium">
                What went wrong with this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          <div>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="font-medium">
                What can be improved in this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MeasureDebrief;
