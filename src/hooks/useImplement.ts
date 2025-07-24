import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Json } from '@/integrations/supabase/types';
// Use the locally exported MEASURE_STAGE_ID

export interface KeyMetric {
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

export interface ImplementationPlan {
  phases: Array<{
    name: string;
    description: string;
    duration: string;
    tasks: Array<{
      task: string;
      responsible: string;
      timeline: string;
      dependencies: string[];
    }>;
  }>;
  timeline: string;
  resources: Array<{
    type: string;
    description: string;
    quantity: string;
  }>;
  risks: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
}

export interface BudgetPlan {
  totalBudget: string;
  categories: Array<{
    category: string;
    description: string;
    amount: string;
    percentage: number;
  }>;
  timeline: Array<{
    period: string;
    amount: string;
    description: string;
  }>;
  assumptions: Array<{
    assumption: string;
    impact: string;
  }>;
  contingencies: Array<{
    item: string;
    amount: string;
    reason: string;
  }>;
}

export interface ImplementData {
  metrics: KeyMetric[];
  implementationPlan?: ImplementationPlan;
  budget?: BudgetPlan;
  files?: string[];
  measureDebriefReflections?: {
    wentWell: string;
    wentWrong: string;
    improvements: string;
  };
}

interface ImplementState {
  data: ImplementData;
  isLoading: boolean;
  isDirty: boolean;
  rowId: string | null;
}

const initialData: ImplementData = {
  metrics: [],
  implementationPlan: undefined,
  budget: undefined,
  files: [],
};

// Implement and Measure stage_ids for Design Thinking
export const IMPLEMENT_STAGE_ID = '660e8400-e29b-41d4-a716-446655440007';
export const MEASURE_STAGE_ID = '660e8400-e29b-41d4-a716-446655440008';

// Accepts a stageId param (defaults to IMPLEMENT_STAGE_ID)
export const useImplement = (projectIdProp: string | null, stageId: string = IMPLEMENT_STAGE_ID) => {
  const [state, setState] = useState<ImplementState>({
    data: initialData,
    isLoading: false,
    isDirty: false,
    rowId: null,
  });
  const [projectId, setProjectId] = useState<string | null>(projectIdProp);
  const { toast } = useToast();

  // Accepts an optional callback to run after state is updated
  const updateData = (updates: Partial<ImplementData>, callback?: () => void) => {
    setState(prev => {
      const newState = {
        ...prev,
        data: { ...prev.data, ...updates },
        isDirty: true,
      };
      if (callback) setTimeout(callback, 0); // Run after state update
      return newState;
    });
  };

  const resetData = () => {
    setState({
      data: initialData,
      isLoading: false,
      isDirty: false,
      rowId: null,
    });
  };

  const loadImplement = async () => {
    if (!projectId) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('stage_contents')
        .select('*')
        .eq('project_id', projectId)
        .eq('stage_id', stageId)
        .maybeSingle();
      if (error) throw error;
      if (data && data.project_id === projectId && data.stage_id === stageId) {
        let structure: ImplementData = initialData;
        if (
          data.content_data &&
          typeof data.content_data === 'object' &&
          !Array.isArray(data.content_data)
        ) {
          structure = data.content_data as unknown as ImplementData;
        }
        setState({
          data: structure,
          isLoading: false,
          isDirty: false,
          rowId: data.id,
        });
        return structure;
      } else {
        setState(prev => ({ ...prev, isLoading: false, rowId: null }));
        return initialData;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load implement data',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      return initialData;
    }
  };

  const saveImplement = async (dataOverride?: ImplementData) => {
    let currentProjectId = projectId;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Get current user id
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;
      if (userError) {
        console.error('Error fetching user:', userError);
      }
      let data, error;
      // Always check the DB for an existing row for this project/stage
      const { data: existingRow, error: fetchError } = await supabase
        .from('stage_contents')
        .select('id')
        .eq('project_id', currentProjectId)
        .eq('stage_id', stageId)
        .maybeSingle();
      if (fetchError) throw fetchError;
      const contentData = dataOverride || state.data;
      if (existingRow && existingRow.id) {
        // Update the existing row using the DB id
        ({ data, error } = await supabase
          .from('stage_contents')
          .update({
            content_data: contentData as unknown as Json,
            updated_by: userId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRow.id)
          .select());
        setState(prev => ({ ...prev, rowId: existingRow.id }));
      } else {
        // Insert a new row
        const newId = uuidv4();
        ({ data, error } = await supabase
          .from('stage_contents')
          .insert({
            id: newId,
            project_id: currentProjectId,
            stage_id: stageId,
            content_data: contentData as unknown as Json,
            created_at: new Date().toISOString(),
            created_by: userId,
          })
          .select());
        setState(prev => ({ ...prev, rowId: newId }));
      }
      if (error) throw error;
      setState(prev => ({ ...prev, isLoading: false, isDirty: false }));
      toast({
        title: 'Success',
        description: 'Implement data saved successfully',
      });
      // --- Check and update isCompleteImplement in metadata ---
      const metrics = contentData.metrics || [];
      if (Array.isArray(metrics) && metrics.length > 0 && currentProjectId) {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('metadata')
          .eq('id', currentProjectId)
          .single();
        if (!projectError) {
          let metadata = projectData?.metadata;
          if (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata)) {
            metadata = {};
          }
          if (!metadata.isCompleteImplement) {
            await supabase
              .from('projects')
              .update({ metadata: { ...metadata, isCompleteImplement: true } })
              .eq('id', currentProjectId);
          }
        }
      }
      // --- End block ---
      return { data, projectId: currentProjectId };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Error',
        description: 'Failed to save implement data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const generateMetrics = async (projectContext: {
    projectName: string;
    projectDescription?: string;
    projectProblem?: string;
    projectCustomers?: string;
    targetOutcomes?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-metrics', {
        body: projectContext
      });
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      if (data?.metrics && Array.isArray(data.metrics)) {
        // Ensure state is updated before saving and syncing
        let newData: ImplementData;
        await new Promise<void>(resolve => {
          updateData({ metrics: data.metrics }, () => {
            newData = { ...state.data, metrics: data.metrics };
            resolve();
          });
        });
        await saveImplement(newData);
        toast({
          title: 'Metrics Generated',
          description: 'AI has generated key performance indicators for your project.',
        });
        return data.metrics;
      } else {
        throw new Error('Invalid metrics data received from edge function');
      }
    } catch (error) {
      // Check if it's a CORS or deployment issue
      if (error.message?.includes('CORS') || error.message?.includes('Failed to send a request')) {
        toast({
          title: 'Service Unavailable',
          description: 'The AI service is currently unavailable. Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Failed to generate metrics. Please try again.',
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const generateImplementationPlan = async (projectContext: {
    projectName: string;
    projectDescription?: string;
    projectProblem?: string;
    projectCustomers?: string;
    targetOutcomes?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-implementation-plan', {
        body: projectContext
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (data?.implementationPlan) {
        let newData: ImplementData;
        await new Promise<void>(resolve => {
          updateData({ implementationPlan: data.implementationPlan }, () => {
            newData = { ...state.data, implementationPlan: data.implementationPlan };
            resolve();
          });
        });
        await saveImplement(newData);
        toast({
          title: 'Implementation Plan Generated',
          description: 'AI has generated a comprehensive implementation plan for your project.',
        });
        return data.implementationPlan;
      } else {
        throw new Error('Invalid implementation plan data received from edge function');
      }
    } catch (error) {
      // Check if it's a CORS or deployment issue
      if (error.message?.includes('CORS') || error.message?.includes('Failed to send a request')) {
        toast({
          title: 'Service Unavailable',
          description: 'The AI service is currently unavailable. Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Failed to generate implementation plan. Please try again.',
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const generateBudget = async (projectContext: {
    projectName: string;
    projectDescription?: string;
    projectProblem?: string;
    projectCustomers?: string;
    targetOutcomes?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-budget', {
        body: projectContext
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (data?.budgetPlan) {
        let newData: ImplementData;
        await new Promise<void>(resolve => {
          updateData({ budget: data.budgetPlan }, () => {
            newData = { ...state.data, budget: data.budgetPlan };
            resolve();
          });
        });
        await saveImplement(newData);
        toast({
          title: 'Budget Plan Generated',
          description: 'AI has generated a comprehensive budget plan for your project.',
        });
        return data.budgetPlan;
      } else {
        throw new Error('Invalid budget plan data received from edge function');
      }
    } catch (error) {
      // Check if it's a CORS or deployment issue
      if (error.message?.includes('CORS') || error.message?.includes('Failed to send a request')) {
        toast({
          title: 'Service Unavailable',
          description: 'The AI service is currently unavailable. Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Failed to generate budget plan. Please try again.',
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const generateMeasureDebriefReflections = async (projectContext: {
    projectName: string;
    projectDescription?: string;
    metrics?: KeyMetric[];
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-measure-debrief', {
        body: projectContext
      });
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      if (data?.wentWell && data?.wentWrong && data?.improvements) {
        let newData: ImplementData;
        await new Promise<void>(resolve => {
          updateData({ measureDebriefReflections: data }, () => {
            newData = { ...state.data, measureDebriefReflections: data };
            resolve();
          });
        });
        await saveImplement(newData);
        toast({
          title: 'Debrief & Reflections Generated',
          description: 'AI has generated a debrief and reflection for your project.',
        });
        return data;
      } else {
        throw new Error('Invalid debrief data received from edge function');
      }
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate debrief. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Helper function to detect OKR structure
  const isOKRArray = (metrics: any): metrics is { objective: string; keyResults: KeyMetric[] }[] => {
    return Array.isArray(metrics) && metrics.length > 0 && typeof metrics[0].objective === 'string' && Array.isArray(metrics[0].keyResults);
  };

  const updateMetric = (index: number, updatedMetric: KeyMetric) => {
    if (!state.data.metrics) return;
    
    if (isOKRArray(state.data.metrics)) {
      // Handle OKR structure - find the metric in the first objective for now
      const updatedMetrics = [...state.data.metrics];
      if (updatedMetrics.length > 0 && updatedMetrics[0].keyResults) {
        updatedMetrics[0] = {
          ...updatedMetrics[0],
          keyResults: updatedMetrics[0].keyResults.map((metric, i) => i === index ? updatedMetric : metric)
        };
      }
      updateData({ metrics: updatedMetrics });
    } else {
      // Handle legacy array structure
      const updatedMetrics = [...state.data.metrics];
      updatedMetrics[index] = updatedMetric;
      updateData({ metrics: updatedMetrics });
    }
    
    saveImplement();
    
    toast({
      title: 'Progress Updated',
      description: 'Metric progress has been updated successfully.',
    });
  };

  const addMetric = (newMetric: KeyMetric) => {
    if (isOKRArray(state.data.metrics)) {
      // Handle OKR structure - add to the first objective
      const updatedMetrics = [...state.data.metrics];
      if (updatedMetrics.length > 0) {
        updatedMetrics[0] = {
          ...updatedMetrics[0],
          keyResults: [...(updatedMetrics[0].keyResults || []), newMetric]
        };
      } else {
        // If no objectives exist, create one
        updatedMetrics.push({
          objective: 'New Objective',
          keyResults: [newMetric]
        });
      }
      updateData({ metrics: updatedMetrics });
    } else {
      // Handle legacy array structure
      const updatedMetrics = [...(state.data.metrics || []), newMetric];
      updateData({ metrics: updatedMetrics });
    }
    
    saveImplement();
    
    toast({
      title: 'Metric Added',
      description: 'New metric has been added successfully.',
    });
  };

  return {
    ...state,
    updateData,
    resetData,
    loadImplement,
    saveImplement,
    generateMetrics,
    generateImplementationPlan,
    generateBudget,
    updateMetric,
    addMetric,
    generateMeasureDebriefReflections,
    projectId,
    isDirty: state.isDirty,
  };
}; 