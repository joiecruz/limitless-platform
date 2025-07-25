import React from 'react';

interface MeasureProgressBarProps {
  title: string;
  percentage: number;
  color?: string;
  icon?: React.ReactNode;
  current: number;
  target: number;
}

const MeasureProgressBar: React.FC<MeasureProgressBarProps> = ({
  title,
  percentage,
  color = '#393CA0',
  icon,
  target
}) => {
  return (
    <div className="rounded-lg border shadow-sm bg-white h-[200px]">
      <div className="p-6">
        <div className="flex items-start">
          <div
            className="rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            <div className="text-white">{icon}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Key Result</div>
            <div className="font-semibold text-gray-800">{title}</div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Target</span>
            <span className="text-sm font-medium text-gray-700">{percentage}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div
              className="h-full rounded-full"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasureProgressBar;
