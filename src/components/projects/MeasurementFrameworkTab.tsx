import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WandSparkles } from 'lucide-react';
import { KeyMetric } from '@/hooks/useImplement';
import { useToast } from '@/hooks/use-toast';
import EditMetricModal from '@/components/projects/EditMetricModal';
import UpdateProgressModal from '@/components/projects/UpdateProgressModal';

interface OKR {
  objective: string;
  keyResults: KeyMetric[];
}

// Type guard for OKR structure
function isOKRArray(metrics: any): metrics is { objective: string; keyResults: KeyMetric[] }[] {
  return Array.isArray(metrics) && metrics.length > 0 && typeof metrics[0].objective === 'string' && Array.isArray(metrics[0].keyResults);
}

interface MeasurementFrameworkTabProps {
  metrics: any;
  isLoading: boolean;
  isGenerating: boolean;
  onGenerateMetrics: () => void;
  onUpdateData: (data: any) => void;
  onSaveImplement: (data?: any) => void;
  onUpdateMetric: (index: number, metric: KeyMetric) => void;
  onAddMetric: (metric: KeyMetric) => void;
}

export default function MeasurementFrameworkTab({
  metrics,
  isLoading,
  isGenerating,
  onGenerateMetrics,
  onUpdateData,
  onSaveImplement,
  onUpdateMetric,
  onAddMetric,
}: MeasurementFrameworkTabProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isQuickUpdateModalOpen, setIsQuickUpdateModalOpen] = useState(false);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number | [number, number] | null>(null);
  const [isAddingNewMetric, setIsAddingNewMetric] = useState(false);
  const { toast } = useToast();

  // OKR helpers
  function getOKRMetric(metrics: any, selectedMetricIndex: number | [number, number] | null) {
    if (Array.isArray(selectedMetricIndex)) {
      const [objIdx, krIdx] = selectedMetricIndex;
      if (isOKRArray(metrics)) {
        return metrics[objIdx]?.keyResults?.[krIdx] || null;
      }
      return null;
    } else if (typeof selectedMetricIndex === 'number') {
      return metrics?.[selectedMetricIndex] || null;
    }
    return null;
  }

  function updateOKRMetric(metrics: any, selectedMetricIndex: number | [number, number], updatedMetric: KeyMetric) {
    if (Array.isArray(selectedMetricIndex)) {
      const [objIdx, krIdx] = selectedMetricIndex;
      if (isOKRArray(metrics)) {
        const newMetrics = [...metrics];
        newMetrics[objIdx] = {
          ...newMetrics[objIdx],
          keyResults: newMetrics[objIdx].keyResults.map((kr, i) => i === krIdx ? updatedMetric : kr)
        };
        return newMetrics;
      }
      return metrics;
    } else if (typeof selectedMetricIndex === 'number') {
      return metrics.map((m, i) => i === selectedMetricIndex ? updatedMetric : m);
    }
    return metrics;
  }

  // Modal handlers
  const handleEditMetric = (indexOrIndices: number | [number, number]) => {
    setSelectedMetricIndex(indexOrIndices);
    setIsAddingNewMetric(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateProgress = (indexOrIndices: number | [number, number]) => {
    setSelectedMetricIndex(indexOrIndices);
    setIsQuickUpdateModalOpen(true);
  };

  const handleAddNewMetric = () => {
    setSelectedMetricIndex(null);
    setIsAddingNewMetric(true);
    setIsUpdateModalOpen(true);
  };

  const handleMetricUpdate = (updatedMetric: KeyMetric) => {
    if (selectedMetricIndex !== null) {
      if (Array.isArray(selectedMetricIndex)) {
        // OKR structure - update the specific key result
        const newMetrics = updateOKRMetric(metrics, selectedMetricIndex, updatedMetric);
        onUpdateData({ metrics: newMetrics });
        // Save immediately to database with latest data
        onSaveImplement({ ...metrics, metrics: newMetrics });
        toast({
          title: 'Metric Updated',
          description: 'Metric has been updated successfully.',
        });
      } else {
        // Legacy structure - use the hook's updateMetric function
        onUpdateMetric(selectedMetricIndex, updatedMetric);
      }
    }
  };

  const handleMetricAdd = (newMetric: KeyMetric) => {
    if (isOKRArray(metrics)) {
      // For OKR structure, add to the first objective's key results
      const newMetrics = [...metrics];
      if (newMetrics.length > 0) {
        newMetrics[0] = {
          ...newMetrics[0],
          keyResults: [...(newMetrics[0].keyResults || []), newMetric]
        };
      } else {
        // If no objectives exist, create one
        newMetrics.push({
          objective: 'New Objective',
          keyResults: [newMetric]
        });
      }
      onUpdateData({ metrics: newMetrics });
      onSaveImplement({ ...metrics, metrics: newMetrics });
      toast({
        title: 'Metric Added',
        description: 'New metric has been added successfully.',
      });
    } else {
      // Legacy structure - use the hook's addMetric function
      onAddMetric(newMetric);
    }
  };

  // Instructional box with generate/regenerate button
  const instructionBox = (
    <div className="flex items-center bg-white border rounded-lg shadow-sm p-6 mb-6">
      <div className="flex-1 mr-2">
        <h2 className="text-md font-semibold mb-1">
          Set the key indicators that will determine the success of your project
        </h2>
        <p className="text-gray-600 text-sm">
          Identify the key indicators that will guide your project to success by using the Objectives and Key Results (OKRs) framework. OKRs help you define clear, measurable goals that align with your broader project objectives.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white shadow-sm"
          onClick={onGenerateMetrics}
          disabled={isGenerating || isLoading}
        >
          <WandSparkles className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : (metrics && metrics.length > 0 ? 'Regenerate' : 'Generate')}
        </Button>
        <Button
          variant="outline"
          onClick={handleAddNewMetric}
          disabled={isLoading}
        >
          Add Metric
        </Button>
      </div>
    </div>
  );

  if (!metrics || metrics.length === 0) {
    return (
      <>
        {instructionBox}
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center min-h-[200px]">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">No measurement framework yet</h3>
            <p className="text-gray-500 mb-2">Generate your measurement framework to see it here.</p>
          </div>
        </div>
        <EditMetricModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          metric={getOKRMetric(metrics, selectedMetricIndex)}
          onUpdate={handleMetricUpdate}
          onAdd={handleMetricAdd}
          isNewMetric={isAddingNewMetric}
        />
        <UpdateProgressModal
          isOpen={isQuickUpdateModalOpen}
          onClose={() => setIsQuickUpdateModalOpen(false)}
          metric={getOKRMetric(metrics, selectedMetricIndex)}
          onUpdate={handleMetricUpdate}
        />
      </>
    );
  }

  if (isOKRArray(metrics)) {
    const okrMetrics = metrics as { objective: string; keyResults: KeyMetric[] }[];
    return (
      <>
        {instructionBox}
        <div className="space-y-6">
          {okrMetrics.map((okr, objIdx) => (
            <div key={okr.objective + '-' + objIdx} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4">
                <span className="inline-block align-middle"><svg width="14" height="14" fill="none"><circle cx="7" cy="7" r="7" fill="#393CA0"/></svg></span>
                <span className="font-bold text-gray-900 text-lg">{okr.objective}</span>
              </div>
              <div className="overflow-x-auto px-2 pb-4">
                <table className="w-full text-sm border-collapse">
                  <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col style={{ width: '120px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white border-r border-gray-200">
                        Indicator
                      </th>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white border-r border-gray-200 text-center">
                        Target
                      </th>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white border-r border-gray-200 text-center">
                        Unit
                      </th>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white border-r border-gray-200 text-center">
                        Due
                      </th>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white border-r border-gray-200">
                        Last Updated
                      </th>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white border-r border-gray-200">
                        Progress
                      </th>
                      <th className="py-3 px-5 font-bold text-gray-800 text-center border-b-2 border-[#393CA0] bg-white align-middle" style={{fontSize:'1em', minWidth:'110px', width:'110px'}}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {okr.keyResults && okr.keyResults.length > 0 ? (
                      okr.keyResults.map((metric, krIdx) => (
                        <tr key={okr.objective + '-' + (metric.indicator || krIdx)} className="border-b border-gray-200 bg-white">
                          <td className="py-4 px-7 align-top border-r border-gray-200">
                            <div className="font-medium text-gray-900 mb-1">{metric.indicator}</div>
                          </td>
                          <td className="py-4 px-5 align-top border-r border-gray-200 text-center">
                            <span className="font-semibold text-gray-700">{metric.target ?? '-'}</span>
                          </td>
                          <td className="py-4 px-5 align-top border-r border-gray-200 text-center">
                            {metric.unit ?? '-'}
                          </td>
                          <td className="py-4 px-5 align-top border-r border-gray-200 text-center">
                            {metric.due ?? '-'}
                          </td>
                          <td className="py-4 px-5 align-top border-r border-gray-200">
                            <div>{metric.lastUpdated?.value ?? '-'}</div>
                            <div className="text-xs text-gray-500">Updated {metric.lastUpdated?.date ?? '-'}</div>
                          </td>
                          <td className="py-4 px-5 align-top w-48 border-r border-gray-200">
                            <div className="relative pt-1 flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    (metric.progress ?? 0) >= 80 ? 'bg-emerald-500' :
                                    (metric.progress ?? 0) >= 60 ? 'bg-blue-500' :
                                    (metric.progress ?? 0) >= 40 ? 'bg-yellow-500' :
                                    (metric.progress ?? 0) >= 20 ? 'bg-orange-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${metric.progress ?? 0}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700 min-w-[32px] text-right">{metric.progress ?? 0}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 align-middle text-center" style={{minWidth:'110px', width:'110px'}}>
                            <div className="flex gap-2 items-center justify-center">
                              <Button
                                onClick={() => handleEditMetric([objIdx, krIdx])}
                                className="border border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0]/10 px-3 rounded font-medium shadow-sm"
                                variant="ghost"
                                size="sm"
                                aria-label="Edit metric"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleUpdateProgress([objIdx, krIdx])}
                                className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 rounded font-medium shadow-sm"
                                variant="outline"
                                size="sm"
                                aria-label="Update progress"
                              >
                                Update
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={okr.objective + '-empty'}><td colSpan={7} className="py-3 px-5 text-gray-400 italic bg-white">No key results for this objective.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <EditMetricModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          metric={getOKRMetric(metrics, selectedMetricIndex)}
          onUpdate={handleMetricUpdate}
          onAdd={handleMetricAdd}
          isNewMetric={isAddingNewMetric}
        />
        <UpdateProgressModal
          isOpen={isQuickUpdateModalOpen}
          onClose={() => setIsQuickUpdateModalOpen(false)}
          metric={getOKRMetric(metrics, selectedMetricIndex)}
          onUpdate={handleMetricUpdate}
        />
      </>
    );
  } else if (Array.isArray(metrics) && metrics.length > 0) {
    const legacyMetrics = metrics as KeyMetric[];
    return (
      <>
        {instructionBox}
        <div className="bg-white rounded-lg border shadow-sm p-8 text-center text-gray-500">
          <div>
            <h3 className="text-lg font-medium mb-2">Legacy Metrics</h3>
            <ul className="list-disc list-inside">
              {legacyMetrics.map((metric, idx) => (
                <li key={idx}>
                  <strong>{metric.indicator}</strong> (Target: {metric.target}, Unit: {metric.unit})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <EditMetricModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          metric={getOKRMetric(metrics, selectedMetricIndex)}
          onUpdate={handleMetricUpdate}
          onAdd={handleMetricAdd}
          isNewMetric={isAddingNewMetric}
        />
        <UpdateProgressModal
          isOpen={isQuickUpdateModalOpen}
          onClose={() => setIsQuickUpdateModalOpen(false)}
          metric={getOKRMetric(metrics, selectedMetricIndex)}
          onUpdate={handleMetricUpdate}
        />
      </>
    );
  }

  return (
    <>
      {instructionBox}
      <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center p-8">
          No valid OKR-based metrics found. Please generate your measurement framework.
        </div>
      </div>
      <EditMetricModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        metric={getOKRMetric(metrics, selectedMetricIndex)}
        onUpdate={handleMetricUpdate}
        onAdd={handleMetricAdd}
        isNewMetric={isAddingNewMetric}
      />
      <UpdateProgressModal
        isOpen={isQuickUpdateModalOpen}
        onClose={() => setIsQuickUpdateModalOpen(false)}
        metric={getOKRMetric(metrics, selectedMetricIndex)}
        onUpdate={handleMetricUpdate}
      />
    </>
  );
} 