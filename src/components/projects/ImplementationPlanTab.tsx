import React from 'react';
import { Button } from '@/components/ui/button';
import { WandSparkles } from 'lucide-react';

interface ImplementationPlan {
  timeline?: string;
  phases?: Array<{
    name: string;
    description: string;
    duration: string;
    tasks?: Array<{
      task: string;
      responsible: string;
      timeline: string;
      dependencies?: string[];
    }>;
  }>;
  resources?: Array<{
    type: string;
    description: string;
    quantity: string;
  }>;
  risks?: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
}

interface ImplementationPlanTabProps {
  plan: ImplementationPlan | null;
  isLoading: boolean;
  isGenerating: boolean;
  onGenerateImplementationPlan: () => void;
}

export default function ImplementationPlanTab({
  plan,
  isLoading,
  isGenerating,
  onGenerateImplementationPlan,
}: ImplementationPlanTabProps) {
  // Instructional box with generate/regenerate button
  const instructionBox = (
    <div className="flex items-center bg-white border rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex-1">
        <h2 className="text-md font-semibold mb-1">Implementation Plan</h2>
        <p className="text-gray-600 text-sm">
          Create a detailed implementation plan for your project. This plan should outline the phases, tasks, resources, and risks to ensure successful execution.
        </p>
      </div>
      <Button 
        className="ml-6 bg-[#393CA0] hover:bg-[#393CA0]/90 shadow-sm"
        onClick={onGenerateImplementationPlan}
        disabled={isGenerating || isLoading}
      >
        <WandSparkles className="mr-2 h-4 w-4" />
        {isGenerating ? 'Generating...' : (plan ? 'Regenerate' : 'Generate')}
      </Button>
    </div>
  );

  if (isLoading) {
    return <>{instructionBox}</>;
  }

  if (!plan) {
    return (
      <>
        {instructionBox}
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center min-h-[200px]">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">No implementation plan yet</h3>
            <p className="text-gray-500 mb-2">Generate an implementation plan to see it here.</p>
          </div>
        </div>
      </>
    );
  }

  // --- Redesigned Implementation Plan ---
  return (
    <>
      {instructionBox}
      <div className="flex flex-col gap-8">
        {/* Timeline/Stepper for Phases */}
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-200 rounded-full" style={{ zIndex: 0 }}></div>
          {plan.phases && plan.phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="relative mb-8">
              <div className="flex items-center mb-2">
                <div className="z-10 w-6 h-6 flex items-center justify-center rounded-full bg-[#393CA0] text-white font-bold shadow-md border-2 border-white">
                  {phaseIndex + 1}
                </div>
                <h4 className="ml-4 font-semibold text-lg">{phase.name}</h4>
                <span className="ml-4 text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">{phase.duration}</span>
              </div>
              <div className="ml-10 bg-white border rounded-lg p-4 shadow-sm">
                <p className="text-gray-600 mb-2">{phase.description}</p>
                {/* Tasks as cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {phase.tasks && phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="bg-gray-50 border rounded-lg p-3 flex flex-col gap-1 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-4 h-4 bg-blue-500 rounded-full"></span>
                        <span className="font-medium">{task.task}</span>
                      </div>
                      <div className="text-xs text-gray-500">Responsible: <span className="font-semibold text-gray-700">{task.responsible}</span></div>
                      <div className="text-xs text-gray-500">Timeline: <span className="font-semibold text-gray-700">{task.timeline}</span></div>
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="text-xs text-gray-500">Dependencies: <span className="font-semibold text-gray-700">{task.dependencies.join(', ')}</span></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Resources and Risks as cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2"><span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span>Resources</h4>
            <div className="grid grid-cols-1 gap-3">
              {plan.resources && plan.resources.map((resource, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium">{resource.type}</p>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <p className="text-xs text-gray-500"><strong>Quantity:</strong> {resource.quantity}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2"><span className="inline-block w-4 h-4 bg-red-500 rounded-full"></span>Risks & Mitigation</h4>
            <div className="grid grid-cols-1 gap-3">
              {plan.risks && plan.risks.map((risk, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium text-red-600">{risk.risk}</p>
                  <p className="text-xs text-gray-500"><strong>Impact:</strong> {risk.impact}</p>
                  <p className="text-xs text-gray-500"><strong>Mitigation:</strong> {risk.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 