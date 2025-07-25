import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import React from 'react';

export interface ProjectRetrospective {
  wentWell: string;
  wentWrong: string;
  improvements: string;
}

interface MeasureDebriefProps {
  retrospective: ProjectRetrospective;
  onEdit: () => void;
}

const MeasureDebrief: React.FC<MeasureDebriefProps> = ({ retrospective, onEdit }) => {
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
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-colors mb-2">
              <span className="font-medium">
                What went well with this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </div>
            <div className="text-gray-700 text-sm mb-6 whitespace-pre-line">{retrospective.wentWell || <span className="italic text-gray-400">No entry yet.</span>}</div>
          </div>

          <div>
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-colors mb-2">
              <span className="font-medium">
                What went wrong with this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </div>
            <div className="text-gray-700 text-sm mb-6 whitespace-pre-line">{retrospective.wentWrong || <span className="italic text-gray-400">No entry yet.</span>}</div>
          </div>

          <div>
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-colors mb-2">
              <span className="font-medium">
                What can be improved in this project
              </span>
              <ChevronDown className="h-5 w-5" />
            </div>
            <div className="text-gray-700 text-sm mb-6 whitespace-pre-line">{retrospective.improvements || <span className="italic text-gray-400">No entry yet.</span>}</div>
          </div>
        </div>
        {/* Edit button below all content */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            onClick={onEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MeasureDebrief;
