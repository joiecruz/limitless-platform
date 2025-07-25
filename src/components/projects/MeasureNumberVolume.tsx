import React from 'react';

interface MeasureNumberVolumeProps {
  title: string;
  percentage: number;
  color: string;
  icon: JSX.Element;
  delta?: string;
  current: number;
  target: number;
}

const MeasureNumberVolume: React.FC<MeasureNumberVolumeProps> = ({
  title,
  percentage,
  color,
  icon,
  current,
  delta,
  target
}) => {
  return (
    <div className="rounded-lg border shadow-sm bg-white h-[200px]">
      <div className="p-6">
      <div className="mb-4">
          <div className="text-sm 
          text-gray-500">Key Result</div>
          <div className="font-semibold text-medium" style={{ color }}>{title}</div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold mb-3 mt-3">{current}</div>
            <div className="flex 
          items-center justify-between">
            {delta && (
              <div className="text-sm 
              text-green-500 font-medium">
              {delta}</div>
            )}
            {title && (
              <div className="text-sm 
              text-gray-600">
                Target <span 
                className="font-medium">
                {target}</span>
              </div>
            )}
          </div>
          </div>
      </div>
    </div>
    </div>
  );
};

export default MeasureNumberVolume;
