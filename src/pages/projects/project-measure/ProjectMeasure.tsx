import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProjectMeasureProps {
  inNavBar?: boolean;
}

interface KeyMetricResult {
  title: string;
  target: number;
  current: number;
  percentage: number;
  color: string;
  icon: string;
}

export default function ProjectMeasure({
  inNavBar = false,
}: ProjectMeasureProps) {
  usePageTitle('Project Measurement | Limitless Lab');
  const [activeTab, setActiveTab] = useState('metrics');

  const keyResults: KeyMetricResult[] = [
    {
      title: 'Tasks Completed on Time',
      target: 100,
      current: 95,
      percentage: 95,
      color: '#393CA0',
      icon: 'check-circle',
    },
    {
      title: 'Target population onboarded within first year',
      target: 100,
      current: 70,
      percentage: 70,
      color: '#2FD5C8',
      icon: 'users',
    },
    {
      title: 'Increase in banked population within first year',
      target: 100,
      current: 20,
      percentage: 20,
      color: '#FF4D8F',
      icon: 'bank',
    },
  ];

  const content = (
    <div className="container max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header section with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Measure</h1>
          <p className="text-gray-600">
            Evaluate the effectiveness and impact of your innovation project
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">
            <Activity className="h-4 w-4 mr-2" />
            Update Progress
          </Button>
        </div>
      </div>

      {/* Key Results section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {keyResults.map((result, index) => (
          <Card key={index} className="rounded-lg border shadow-sm h-full">
            <div className="p-6">
              {/* Result header with icon and title */}
              <div className="flex items-start">
                <div
                  className="rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ backgroundColor: result.color }}
                >
                  <div className="text-white">
                    {result.icon === 'check-circle' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                    {result.icon === 'users' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    )}
                    {result.icon === 'bank' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="10" width="18" height="11" rx="2" />
                        <path d="M12 2 L2 8 h20 Z" />
                        <line x1="3" y1="16" x2="21" y2="16" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Key Result</div>
                  <div className="font-semibold text-gray-800">
                    {result.title}
                  </div>
                </div>
              </div>

              {/* Progress bar section */}
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Target</span>
                  <span className="text-sm font-medium text-gray-700">
                    {result.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${result.percentage}%`,
                      backgroundColor: result.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column with Transaction Volume and NPS cards  */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          {/* Transaction Volume card */}
          <Card className="rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Key Result</div>
                <div className="font-semibold text-indigo-600">
                  Total Transaction Volume
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-4xl font-bold mb-4">671</div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-500 font-medium">
                    +15% from last week
                  </div>
                  <div className="text-sm text-gray-600">
                    Target <span className="font-medium">1,200</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Net Promoter Score card */}
          <Card className="rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Key Result</div>
                <div className="font-semibold text-pink-500">
                  Net Promoter Score
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-48 h-24">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <path
                      d="M20,90 A80,80 0 0,1 180,90"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20,90 A80,80 0 0,1 100,10"
                      fill="none"
                      stroke="#FF4D8F"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <text
                      x="100"
                      y="70"
                      textAnchor="middle"
                      fontSize="16"
                      fill="#374151"
                      fontWeight="bold"
                    >
                      72/100
                    </text>
                    <text
                      x="100"
                      y="90"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#6B7280"
                    >
                      Progress
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
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
      </div>
    </div>
  );

  return inNavBar ? (
    content
  ) : (
    <div className="bg-[#F9FAFB] min-h-screen">
      <header className="bg-white border-b">
        {/* Header content would go here if needed */}
      </header>
      {content}
    </div>
  );
}
