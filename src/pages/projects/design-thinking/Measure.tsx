import { useState, useEffect, useMemo } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useParams } from 'react-router-dom';
import { useImplement, MEASURE_STAGE_ID, IMPLEMENT_STAGE_ID } from '@/hooks/useImplement';
import { useToast } from '@/hooks/use-toast';
import MeasurementFrameworkTab from '@/components/projects/MeasurementFrameworkTab';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MeasurePieChart from '@/components/projects/MeasurePieChart';
import MeasureNumberVolume from '@/components/projects/MeasureNumberVolume';
import MeasureProgressBar from '@/components/projects/MeasureProgressBar';
import MeasureDebrief from '@/components/projects/MeasureDebrief';

interface MeasureProps {
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

const iconMap: Record<string, JSX.Element> = {
  'check-circle': (
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
  ),
  users: (
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
  ),
  bank: (
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
  ),
};

export default function Measure({
  inNavBar = false,
}: MeasureProps) {
  usePageTitle('Project Measurement | Limitless Lab');
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('metrics');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Only get the functions, do not render any UI for them
  const {
    loadImplement,
    saveImplement,
    updateMetric,
    addMetric,
    // You can add more functions here if needed
  } = useImplement(projectId, IMPLEMENT_STAGE_ID);

  // State for dynamic key results
  const [keyResults, setKeyResults] = useState<KeyMetricResult[]>([]);

  // Helper to load only metrics JSON
  const loadMetrics = async () => {
    const data = await loadImplement();
    return data && data.metrics ? data.metrics : null;
  };

  useEffect(() => {
    loadMetrics().then((metrics) => {
      if (metrics && Array.isArray(metrics)) {
        console.log('Loaded metrics array:', metrics);
        // Map metrics to KeyMetricResult[] (retain only common fields)
        const mapped = metrics.flatMap((okr: any) =>
          Array.isArray(okr.keyResults)
            ? okr.keyResults.map((m: any) => ({
                title: m.indicator || '',
                target: m.target ?? 0,
                current: m.current ?? 0,
                percentage: m.progress ?? 0,
                color: '#393CA0',
                icon: m.icon || 'check-circle',
              }))
            : []
        );
        setKeyResults(mapped);
        console.log('Metrics JSON:', metrics);
      } else {
        setKeyResults([]);
        console.log('No saved key indicators found.');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

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

      <div className="py-4">
        {/* MeasurementFrameworkTab and related UI removed as requested */}
        {/* Keep the rest of the original Measure page content/cards below or in other tabs as needed */}
        {/* Key Results section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {keyResults.map((result, index) => (
            <MeasureProgressBar
              key={index}
              title={result.title}
              percentage={result.percentage}
              color={result.color}
              icon={iconMap[result.icon]}
            />
          ))}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column with Transaction Volume and NPS cards  */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
            {/* Transaction Volume card */}
            <MeasureNumberVolume
              value={671}
              label="Total Transaction Volume"
              delta="+15% from last week"
              target={1200}
              color="#393CA0"
            />

            {/* Net Promoter Score card */}
            <MeasurePieChart
              score={72}
              maxScore={100}
              progress={72}
              color="#FF4D8F"
              label="Net Promoter Score"
            />
          </div>

          {/* Right column */}
          <MeasureDebrief />
        </div>
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