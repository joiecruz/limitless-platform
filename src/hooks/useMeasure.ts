import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Json } from '@/integrations/supabase/types';

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

export interface ProjectRetrospective {
  wentWell: string;
  wentWrong: string;
  improvements: string;
}

export interface MeasureData {
  metrics: KeyMetric[];
  retrospective: ProjectRetrospective;
}

interface MeasureState {
  data: MeasureData;
  isLoading: boolean;
  isDirty: boolean;
  rowId: string | null;
}

const initialData: MeasureData = {
  metrics: [],
  retrospective: {
    wentWell: '',
    wentWrong: '',
    improvements: '',
  },
};

export const MEASURE_STAGE_ID = '660e8400-e29b-41d4-a716-446655440008';

export const useMeasure = (projectIdProp: string | null) => {
  const [state, setState] = useState<MeasureState>({
    data: initialData,
    isLoading: false,
    isDirty: false,
    rowId: null,
  });
  const [projectId, setProjectId] = useState<string | null>(projectIdProp);
  const { toast } = useToast();

  const updateData = (updates: Partial<MeasureData>, callback?: () => void) => {
    setState(prev => {
      const newState = {
        ...prev,
        data: { ...prev.data, ...updates },
        isDirty: true,
      };
      if (callback) setTimeout(callback, 0);
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

  const loadMeasure = async () => {
    if (!projectId) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('stage_contents')
        .select('*')
        .eq('project_id', projectId)
        .eq('stage_id', MEASURE_STAGE_ID)
        .maybeSingle();
      if (error) throw error;
      if (data && data.project_id === projectId && data.stage_id === MEASURE_STAGE_ID) {
        let structure: MeasureData = initialData;
        if (
          data.content_data &&
          typeof data.content_data === 'object' &&
          !Array.isArray(data.content_data)
        ) {
          structure = data.content_data as unknown as MeasureData;
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
        description: 'Failed to load measure data',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      return initialData;
    }
  };

  const saveMeasure = async (dataOverride?: MeasureData) => {
    let currentProjectId = projectId;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;
      if (userError) {
        console.error('Error fetching user:', userError);
      }
      let data, error;
      const { data: existingRow, error: fetchError } = await supabase
        .from('stage_contents')
        .select('id')
        .eq('project_id', currentProjectId)
        .eq('stage_id', MEASURE_STAGE_ID)
        .maybeSingle();
      if (fetchError) throw fetchError;
      const contentData = dataOverride || state.data;
      if (existingRow && existingRow.id) {
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
        const newId = uuidv4();
        ({ data, error } = await supabase
          .from('stage_contents')
          .insert({
            id: newId,
            project_id: currentProjectId,
            stage_id: MEASURE_STAGE_ID,
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
        description: 'Measure data saved successfully',
      });
      return { data, projectId: currentProjectId };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Error',
        description: 'Failed to save measure data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateMetric = (index: number, updatedMetric: KeyMetric) => {
    if (!state.data.metrics) return;
    const updatedMetrics = [...state.data.metrics];
    updatedMetrics[index] = updatedMetric;
    updateData({ metrics: updatedMetrics });
    saveMeasure();
    toast({
      title: 'Progress Updated',
      description: 'Metric progress has been updated successfully.',
    });
  };

  const addMetric = (newMetric: KeyMetric) => {
    const updatedMetrics = [...(state.data.metrics || []), newMetric];
    updateData({ metrics: updatedMetrics });
    saveMeasure();
    toast({
      title: 'Metric Added',
      description: 'New metric has been added successfully.',
    });
  };

  const updateRetrospective = (retrospective: ProjectRetrospective) => {
    const newData = { ...state.data, retrospective };
    updateData({ retrospective });
    saveMeasure(newData);
    toast({
      title: 'Retrospective Updated',
      description: 'Project retrospective has been updated successfully.',
    });
  };

  return {
    ...state,
    updateData,
    resetData,
    loadMeasure,
    saveMeasure,
    updateMetric,
    addMetric,
    updateRetrospective,
    projectId,
    isDirty: state.isDirty,
  };
}; 