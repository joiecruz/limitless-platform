import React from 'react';
import { Card } from '@/components/ui/card';

interface MeasurePieChartProps {
  title: string;
  percentage: number;
  color: string;
  icon: JSX.Element;
  current: number;
  target: number;
}

// Color logic matching progress bars
function getProgressColor(progress: number) {
  if (progress >= 80) return '#10B981'; // emerald-500
  if (progress >= 60) return '#3B82F6'; // blue-500
  if (progress >= 40) return '#F59E42'; // yellow-500
  if (progress >= 20) return '#FB923C'; // orange-500
  return '#EF4444'; // red-500
}

const MeasurePieChart: React.FC<MeasurePieChartProps> = ({
  title,
  percentage,
  color,
  current,
  icon,
  target
}) => {
  // SVG settings for half circle
  const size = 150;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const arcColor = color || getProgressColor(percentage);

  // For half circle, circumference is only half
  const halfCircumference = Math.PI * radius;
  const progressLength = (percentage / 100) * halfCircumference;
  const dashArray = halfCircumference;
  const dashOffset = halfCircumference - progressLength;

  return (
    <div className="rounded-lg border shadow-sm bg-white h-[200px]">
      <div className="p-6">
        <div className="text-sm 
          text-gray-500">Key Result</div>
        <div className="mb-2 flex items-center gap-2">
          <div className="font-semibold" style={{ color }}>{title}</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-40 h-24">
            <svg viewBox={`0 0 ${size} ${size / 2}`} width={size} height={size / 2} className="w-full h-full">
              {/* Background half circle */}
              <path
                d={`M ${centerX - radius},${centerY} A ${radius},${radius} 0 0 1 ${centerX + radius},${centerY}`}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <path
                d={`M ${centerX - radius},${centerY} A ${radius},${radius} 0 0 1 ${centerX + radius},${centerY}`}
                fill="none"
                stroke={arcColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.3s' }}
              />
              {/* Progress label */}
              <text
                x={centerX}
                y={centerY - 30}
                textAnchor="middle"
                fontSize="12"
                fill="#6B7280"
                fontWeight="normal"
                dominantBaseline="middle"
              >
                Progress
              </text>
              {/* Current/Target text below percentage */}
              <text
                x={centerX}
                y={centerY - 4}
                textAnchor="middle"
                fontSize="22"
                fill="#4B5563"
                fontWeight="bold"
                dominantBaseline="middle"
              >
                {typeof (current) !== 'undefined' && typeof (target) !== 'undefined' ? `${current}/${target}` : ''}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurePieChart;
