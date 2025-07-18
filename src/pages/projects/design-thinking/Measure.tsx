import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useParams, useNavigate } from 'react-router-dom';
import { useImplement, MEASURE_STAGE_ID, IMPLEMENT_STAGE_ID } from '@/hooks/useImplement';
import { useMeasure } from '@/hooks/useMeasure';
import { useToast } from '@/hooks/use-toast';
import MeasurementFrameworkTab from '@/components/projects/MeasurementFrameworkTab';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MeasurePieChart from '@/components/projects/MeasurePieChart';
import MeasureNumberVolume from '@/components/projects/MeasureNumberVolume';
import MeasureProgressBar from '@/components/projects/MeasureProgressBar';
import MeasureDebrief from '@/components/projects/MeasureDebrief';
import html2pdf from 'html2pdf.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useStepNavigation } from '@/components/projects/ProjectNavBar';

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
  delta?: string;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { changeStep } = useStepNavigation();

  // Only get the functions, do not render any UI for them (implement logic untouched)
  const {
    loadImplement,
    saveImplement,
    updateMetric,
    addMetric,
    // You can add more functions here if needed
  } = useImplement(projectId, IMPLEMENT_STAGE_ID);

  // --- MEASURE RETROSPECTIVE LOGIC ---
  const {
    data: measureData,
    loadMeasure,
    updateRetrospective,
  } = useMeasure(projectId);
  const [editOpen, setEditOpen] = useState(false);
  const [retrospectiveDraft, setRetrospectiveDraft] = useState({
    wentWell: '',
    wentWrong: '',
    improvements: '',
  });

  useEffect(() => {
    loadMeasure().then((loaded) => {
      if (loaded && loaded.retrospective) {
        setRetrospectiveDraft(loaded.retrospective);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (measureData && measureData.retrospective) {
      setRetrospectiveDraft(measureData.retrospective);
    }
  }, [measureData?.retrospective]);

  const handleEdit = () => setEditOpen(true);
  const handleRetrospectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRetrospectiveDraft((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveRetrospective = () => {
    updateRetrospective(retrospectiveDraft);
    setEditOpen(false);
  };

  // --- END MEASURE RETROSPECTIVE LOGIC ---

  // State for dynamic key results (implement logic untouched)
  const [keyResults, setKeyResults] = useState<KeyMetricResult[]>([]);
  // Refs for dynamic measurement
  const debriefRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const N = 2; // Number of cards in the right column
  const measureRef = useRef<HTMLDivElement>(null);

  // Helper to load only metrics JSON (implement logic untouched)
  const loadMetrics = async () => {
    const data = await loadImplement();
    return data && data.metrics ? data.metrics : null;
  };

  useEffect(() => {
    loadMetrics().then((metrics) => {
      if (metrics && Array.isArray(metrics)) {
        // Map metrics to KeyMetricResult[] (retain only common fields)
        const mapped = metrics.flatMap((okr: any) =>
          Array.isArray(okr.keyResults)
            ? okr.keyResults.map((m: any) => ({
                title: m.indicator || '',
                target: m.target ?? 0, current: Array.isArray(m.lastUpdated) ? m.lastUpdated[0]?.value ?? 0 : m.lastUpdated?.value ?? 0,
                percentage: m.progress ?? 0,
                color: '#393CA0',
                icon: m.icon || 'check-circle',
                delta: m.delta,
              }))
            : []
        );
        setKeyResults(mapped);
      } else {
        setKeyResults([]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useLayoutEffect(() => {
    if (debriefRef.current && cardRef.current) {
      const debriefHeight = debriefRef.current.offsetHeight;
      const cardHeight = cardRef.current.offsetHeight;
      if (debriefHeight > 2 * cardHeight) {
        // setMaxRightCards(2); // This line is removed as per the new logic
      } else {
        // setMaxRightCards(keyResults.length); // This line is removed as per the new logic
      }
    }
  }, [keyResults, debriefRef.current, cardRef.current]);

  const handleProgressEdit = () => {
    toast({
      title: 'Redirected to Implement Page',
      description: 'Update your progress here.',
    });
    changeStep('Implement');
  };

  const content = (
    <div ref={measureRef} className="container max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header section with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Measure</h1>
          <p className="text-gray-600">
            Evaluate the effectiveness and impact of your innovation project
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="outline" className="flex items-center" onClick={() => {
            if (measureRef.current) {
              html2pdf().from(measureRef.current).save('measure.pdf');
            }
          }}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button className="bg-[#393CA0] hover:bg-[#393CA0]/90" onClick={handleProgressEdit}>
            <Activity className="h-4 w-4 mr-2" />
            Update Progress
          </Button>
        </div>
      </div>

      <div className="py-4">
        {/* Two-column section: left = MeasureDebrief, right = up to N cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex flex-col gap-4 w-full md:w-[350px]">
            {(() => {
              const components = [MeasureProgressBar, MeasureNumberVolume, MeasurePieChart];
              const colorCycle = ['#393CA0', '#2FD5C8', '#FF5A96'];
              const rightCards = keyResults.slice(0, N);
              return rightCards.map((result, idx) => {
                const Comp = components[idx % components.length];
                const color = colorCycle[idx % colorCycle.length];
                // Attach ref to the first card for measurement
                const ref = idx === 0 ? cardRef : undefined;
                return (
                  <div ref={ref} key={result.title + '-right-' + idx}>
                    <Comp
                      title={result.title}
                      percentage={result.percentage}
                      color={color}
                      target={result.target}
                      icon={iconMap[result.icon]}
                      current={result.current}
                      {...(Comp === MeasureNumberVolume ? { delta: result.delta } : {})}
                    />
                  </div>
                );
              });
            })()}
          </div>
          <div className="flex-1 min-w-0" ref={debriefRef}>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <MeasureDebrief retrospective={measureData?.retrospective || { wentWell: '', wentWrong: '', improvements: '' }} onEdit={handleEdit} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Project Retrospective</DialogTitle>
                  <DialogDescription>Update your project debrief and reflections below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="wentWell">What went well?</label>
                    <textarea
                      id="wentWell"
                      name="wentWell"
                      className="w-full border rounded p-2 min-h-[60px]"
                      value={retrospectiveDraft.wentWell}
                      onChange={handleRetrospectiveChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="wentWrong">What went wrong?</label>
                    <textarea
                      id="wentWrong"
                      name="wentWrong"
                      className="w-full border rounded p-2 min-h-[60px]"
                      value={retrospectiveDraft.wentWrong}
                      onChange={handleRetrospectiveChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="improvements">What can be improved?</label>
                    <textarea
                      id="improvements"
                      name="improvements"
                      className="w-full border rounded p-2 min-h-[60px]"
                      value={retrospectiveDraft.improvements}
                      onChange={handleRetrospectiveChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveRetrospective} className="bg-[#393CA0] text-white hover:bg-[#393CA0]/90">Save</Button>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overflow cards below the two-column section */}
        {keyResults.length > N && (() => {
          const components = [MeasureProgressBar, MeasureNumberVolume, MeasurePieChart];
          const colorCycle = ['#393CA0', '#2FD5C8', '#FF5A96'];
          const bottomCards = keyResults.slice(N);
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bottomCards.map((result, idx) => {
                const Comp = components[(idx + N) % components.length];
                const color = colorCycle[(idx + N) % colorCycle.length];
                return (
                  <Comp
                    key={result.title + '-bottom-' + idx}
                    title={result.title}
                    percentage={result.percentage}
                    color={color}
                    target={result.target}
                    icon={iconMap[result.icon]}
                    current={result.current}
                    {...(Comp === MeasureNumberVolume ? { delta: result.delta } : {})}
                  />
                );
              })}
            </div>
          );
        })()}
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