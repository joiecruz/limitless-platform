import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WandSparkles } from 'lucide-react';

interface ProjectImplementProps {
  inNavBar?: boolean;
}

interface KeyMetric {
  indicator: string;
  target: number;
  unit: string;
  due: string;
  lastUpdated: {
    value: number;
    date: string;
  };
  progress: number;
}

export default function ProjectImplement({
  inNavBar = false,
}: ProjectImplementProps) {
  usePageTitle('Project Implementation | Limitless Lab');
  const [activeTab, setActiveTab] = useState('measurement-framework');
  const [metrics, setMetrics] = useState<KeyMetric[]>([
    {
      indicator: 'Target population onboarded',
      target: 1200,
      unit: 'pax',
      due: '23/05/2025',
      lastUpdated: {
        value: 205,
        date: '31/01/2025',
      },
      progress: 17,
    },
    {
      indicator: 'Number of tasks completed on time',
      target: 50,
      unit: 'tasks',
      due: '07/02/2025',
      lastUpdated: {
        value: 20,
        date: '30/01/2025',
      },
      progress: 40,
    },
    {
      indicator: 'Increase in bank population within a year',
      target: 80,
      unit: 'percent',
      due: '23/05/2025',
      lastUpdated: {
        value: 16,
        date: '31/01/2025',
      },
      progress: 20,
    },
    {
      indicator: 'Total Monthly Transactions',
      target: 500,
      unit: 'transactions',
      due: '08/02/2025',
      lastUpdated: {
        value: 190,
        date: '30/01/2025',
      },
      progress: 38,
    },
  ]);

  const handleUpdateProgress = (index: number) => {
    //  Update progress
  };

  const content = (
    <div className="container max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Implement</h1>
      <p className="text-gray-600 mb-6">
        Turn your validated ideas into a real-world solution by executing and
        launching your project
      </p>

      <div className="w-full">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex -mb-px">
            <button
              onClick={() => setActiveTab('measurement-framework')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'measurement-framework'
                  ? 'border-[#393CA0] text-[#393CA0]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Measurement Framework
            </button>
            <button
              onClick={() => setActiveTab('implementation-plan')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'implementation-plan'
                  ? 'border-[#393CA0] text-[#393CA0]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Implementation Plan
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'budget'
                  ? 'border-[#393CA0] text-[#393CA0]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'files'
                  ? 'border-[#393CA0] text-[#393CA0]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Files
            </button>
          </div>
        </div>

        {activeTab === 'measurement-framework' && (
          <div className="space-y-6">
            {/* Indicators card  */}
            <div className="bg-white rounded-lg border border-[#393CA0] p-6 relative shadow-sm overflow-hidden">
              <div className="flex items-stretch">
                <div className="pr-8 flex-grow">
                  {' '}
                  <h2 className="text-xl font-bold mb-2">
                    Set the key indicators that will determine the success of
                    your project
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Identify the key indicators that will guide your project to
                    success by using the Objectives and Key Results (OKRs)
                    framework. OKRs help you define clear, measurable goals that
                    align with your broader project objectives. Each objective
                    should be ambitious yet achievable, while the key results
                    are specific, quantifiable milestones that measure progress
                    toward that objective.
                  </p>
                </div>
                <div className="flex-none flex items-center justify-center bg-[#393CA0]/40 px-8 -mr-6 -my-6 ml-4">
                  {/* Generate button */}
                  <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white">
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Indicator
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Target
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Unit
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Due
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Last Updated
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Progress
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">
                        Update Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4">{metric.indicator}</td>
                        <td className="py-4 px-4">{metric.target}</td>
                        <td className="py-4 px-4">{metric.unit}</td>
                        <td className="py-4 px-4">{metric.due}</td>
                        <td className="py-4 px-4">
                          <div>{metric.lastUpdated.value}</div>
                          <div className="text-xs text-gray-500">
                            Updated {metric.lastUpdated.date}
                          </div>
                        </td>
                        <td className="py-4 px-4 w-48">
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                              <div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                                style={{ width: `${metric.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            onClick={() => handleUpdateProgress(index)}
                            className="bg-[#393CA0] hover:bg-[#393CA0]/90"
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                Save changes
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'implementation-plan' && (
          <div className="bg-white rounded-lg border p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center p-12">
              <h3 className="text-xl font-medium mb-2">Implementation Plan</h3>
              <p className="text-gray-500 mb-6">
                Create a detailed implementation plan for your project.
              </p>
              <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                <WandSparkles className="mr-2 h-4 w-4" />
                Generate Implementation Plan
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="bg-white rounded-lg border p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center p-12">
              <h3 className="text-xl font-medium mb-2">Budget Planning</h3>
              <p className="text-gray-500 mb-6">
                Create a budget plan for your project implementation.
              </p>
              <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                <WandSparkles className="mr-2 h-4 w-4" />
                Generate Budget Plan
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-lg border p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center p-12">
              <h3 className="text-xl font-medium mb-2">Project Files</h3>
              <p className="text-gray-500 mb-6">
                Upload and manage files related to your project implementation.
              </p>
              <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90">
                Upload Files
              </Button>
            </div>
          </div>
        )}
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
