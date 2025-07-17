import React from 'react';

interface MeasureNumberVolumeProps {
  value: number | string;
  label: string;
  delta?: string;
  target?: number | string;
  color?: string;
}

const MeasureNumberVolume: React.FC<MeasureNumberVolumeProps> = ({
  value,
  label,
  delta,
  target,
  color = '#393CA0',
}) => {
  return (
    <div className="rounded-lg border shadow-sm bg-white">
      <div className="p-6">
        <div className="mb-4">
          <div className="text-sm text-gray-500">Key Result</div>
          <div className="font-semibold" style={{ color }}>{label}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-4xl font-bold mb-4">{value}</div>
          <div className="flex items-center justify-between">
            {delta && (
              <div className="text-sm text-green-500 font-medium">{delta}</div>
            )}
            {target && (
              <div className="text-sm text-gray-600">
                Target <span className="font-medium">{target}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasureNumberVolume;
