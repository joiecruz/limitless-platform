import React from 'react';
import { Card } from '@/components/ui/card';

interface MeasurePieChartProps {
  score: number;
  maxScore: number;
  progress: number; // percent (0-100)
  color?: string; // Optional override
  label?: string;
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
  score,
  maxScore,
  progress,
  color,
  label = 'Progress',
}) => {
  // SVG settings for full circle
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcColor = color || getProgressColor(progress);

  // Progress arc math
  const progressLength = (progress / 100) * circumference;
  const dashArray = `${progressLength} ${circumference - progressLength}`;

  return (
    <div className="rounded-lg border shadow-sm bg-white">
      <div className="p-6">
        <div className="mb-4">
          <div className="text-sm text-gray-500">Key Result</div>
          <div className="font-semibold" style={{ color }}>{label}</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48">
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="w-full h-full">
              {/* Background full circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={arcColor}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={circumference / 4} // Start at top (12 o'clock)
                strokeLinecap="round"
                style={{
                  transform: `rotate(-90deg)`,
                  transformOrigin: '50% 50%',
                  transition: 'stroke 0.3s',
                }}
              />
              {/* Centered text (smaller) */}
              <text
                x={center}
                y={center - 10}
                textAnchor="middle"
                fontSize="20"
                fill="#374151"
                fontWeight="bold"
                dominantBaseline="middle"
              >
                {score}/{maxScore}
              </text>
              <text
                x={center}
                y={center + 20}
                textAnchor="middle"
                fontSize="14"
                fill="#6B7280"
                dominantBaseline="middle"
              >
                {label}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurePieChart;
