import { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useParams } from 'react-router-dom';
import { useImplement } from '@/hooks/useImplement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MeasurementFrameworkTab from '@/components/projects/MeasurementFrameworkTab';
import ImplementationPlanTab from '@/components/projects/ImplementationPlanTab';
import BudgetTab from '@/components/projects/BudgetTab';
import FilesTab from '@/components/projects/FilesTab';

interface ImplementProps {
  inNavBar?: boolean;
}

export default function Implement({ inNavBar = false }: ImplementProps) {
  usePageTitle('Project Implementation | Limitless Lab');
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('measurement-framework');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectData, setProjectData] = useState<{
    name: string;
    description?: string;
    problem?: string;
    customers?: string;
    targetOutcomes?: string;
  } | null>(null);
  const { toast } = useToast();

  const {
    data: implementData,
    isLoading,
    isDirty,
    updateData,
    saveImplement,
    loadImplement,
    generateMetrics,
    generateImplementationPlan,
    generateBudget,
    updateMetric,
    addMetric,
  } = useImplement(projectId);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    loadImplement().then((data) => {
      // console.log('Loaded implement data:', data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        if (error) throw error;
        const metadata = (project.metadata as any) || {};
        setProjectData({
          name: project.name || '',
          description: project.description || '',
          problem: metadata.problem || '',
          customers: metadata.customers || '',
          targetOutcomes: metadata.targetOutcomes || '',
        });
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // Generation handlers
  const handleGenerateMetrics = async () => {
    if (!projectData?.name) {
      toast({
        title: 'Project name required',
        description: 'Please ensure your project has a name before generating metrics.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      await generateMetrics({
        projectName: projectData.name,
        projectDescription: projectData.description,
        projectProblem: projectData.problem,
        projectCustomers: projectData.customers,
        targetOutcomes: projectData.targetOutcomes,
      });
    } catch (error) {
      console.error('Error generating metrics:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImplementationPlan = async () => {
    if (!projectData?.name) {
      toast({
        title: 'Project name required',
        description: 'Please ensure your project has a name before generating implementation plan.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      await generateImplementationPlan({
        projectName: projectData.name,
        projectDescription: projectData.description,
        projectProblem: projectData.problem,
        projectCustomers: projectData.customers,
        targetOutcomes: projectData.targetOutcomes,
      });
    } catch (error) {
      console.error('Error generating implementation plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBudget = async () => {
    if (!projectData?.name) {
      toast({
        title: 'Project name required',
        description: 'Please ensure your project has a name before generating budget plan.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      await generateBudget({
        projectName: projectData.name,
        projectDescription: projectData.description,
        projectProblem: projectData.problem,
        projectCustomers: projectData.customers,
        targetOutcomes: projectData.targetOutcomes,
      });
      await loadImplement();
    } catch (error: any) {
      console.error('Error generating budget plan:', error);
      toast({
        title: 'Error generating budget plan',
        description: error?.message || 'Failed to generate budget plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Main content
  const content = (
    <div className="container max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Implement</h1>
      <p className="text-gray-600 mb-6">
        Turn your validated ideas into a real-world solution by executing and launching your project
      </p>
      <div className="w-full">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex -mb-px">
            <button
              onClick={() => setActiveTab('measurement-framework')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${activeTab === 'measurement-framework' ? 'border-[#393CA0] text-[#393CA0]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Measurement Framework
            </button>
            <button
              onClick={() => setActiveTab('implementation-plan')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${activeTab === 'implementation-plan' ? 'border-[#393CA0] text-[#393CA0]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Implementation Plan
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${activeTab === 'budget' ? 'border-[#393CA0] text-[#393CA0]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`mr-8 py-4 text-sm font-medium border-b-2 ${activeTab === 'files' ? 'border-[#393CA0] text-[#393CA0]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Files
            </button>
          </div>
        </div>
        <div className="py-4">
        {activeTab === 'measurement-framework' && (
            <MeasurementFrameworkTab
              metrics={implementData.metrics}
              isLoading={isLoading}
              isGenerating={isGenerating}
              onGenerateMetrics={handleGenerateMetrics}
              onUpdateData={updateData}
              onSaveImplement={saveImplement}
              onUpdateMetric={updateMetric}
              onAddMetric={addMetric}
            />
          )}
        {activeTab === 'implementation-plan' && (
            <ImplementationPlanTab
              plan={implementData.implementationPlan}
              isLoading={isLoading}
              isGenerating={isGenerating}
              onGenerateImplementationPlan={handleGenerateImplementationPlan}
            />
          )}
          {activeTab === 'budget' && (
            <BudgetTab
              budget={(!isLoading && !isGenerating) ? implementData.budget : (implementData.budget || null)}
              isLoading={isLoading}
              isBudgetGenerating={isGenerating}
              budgetError={null}
              onGenerateBudget={handleGenerateBudget}
            />
          )}
          {activeTab === 'files' && (
            <FilesTab
              isLoading={isLoading}
              onUploadFile={() => {
                toast({
                  title: 'Upload coming soon!',
                  description: 'File upload functionality will be available in a future update.',
                });
              }}
            />
      )}
            </div>
      </div>
    </div>
  );

  return inNavBar ? content : (
    <div className="bg-[#F9FAFB] min-h-screen">
      <header className="bg-white border-b"></header>
      {content}
    </div>
  );
}