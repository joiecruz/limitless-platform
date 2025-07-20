import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Json } from '@/integrations/supabase/types';

export interface TestData {
  userTestingMethod: string[];
  userTestPlan: string;
  userTestNotes: string;
  userTestInsights: string;
}

export interface TestState {
  data: TestData;
  isLoading: boolean;
  isDirty: boolean;
  rowId: string | null;
}

const initialData: TestData = {
  userTestingMethod: [],
  userTestPlan: '',
  userTestNotes: '',
  userTestInsights: '',
};

// Replace with your actual Test stage UUID
const TEST_STAGE_ID = '660e8400-e29b-41d4-a716-446655440004';

export const useTest = (projectIdProp: string | null) => {
  const [state, setState] = useState<TestState>({
    data: initialData,
    isLoading: false,
    isDirty: false,
    rowId: null,
  });
  const [projectId, setProjectId] = useState<string | null>(projectIdProp);
  const { toast } = useToast();

  const updateData = (updates: Partial<TestData>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      isDirty: true,
    }));
  };

  const resetData = () => {
    setState({
      data: initialData,
      isLoading: false,
      isDirty: false,
      rowId: null,
    });
  };

  const loadTest = async () => {
    if (!projectId) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('stage_contents')
        .select('*')
        .eq('project_id', projectId)
        .eq('stage_id', TEST_STAGE_ID)
        .maybeSingle();
      if (error) throw error;
      if (data && data.project_id === projectId && data.stage_id === TEST_STAGE_ID) {
        let structure: TestData = initialData;
        if (
          data.content_data &&
          typeof data.content_data === 'object' &&
          !Array.isArray(data.content_data)
        ) {
          structure = data.content_data as unknown as TestData;
        }
        setState({
          data: structure,
          isLoading: false,
          isDirty: false,
          rowId: data.id,
        });
        // console.log('Loaded existing Test data for project_id and stage_id:', data);
        return structure;
      } else {
        setState(prev => ({ ...prev, isLoading: false, rowId: null }));
        // console.log('No existing Test data for project_id and stage_id, using initialData');
        return initialData;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load test data',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      return initialData;
    }
  };

  const saveTest = async () => {
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
        .eq('stage_id', TEST_STAGE_ID)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (existingRow && existingRow.id) {
        // Update the existing row using the DB id
        // console.log('UPDATING EXISTING TEST ROW', existingRow.id);
        ({ data, error } = await supabase
          .from('stage_contents')
          .update({
            content_data: state.data as unknown as Json,
            updated_by: userId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRow.id)
          .select());
        setState(prev => ({ ...prev, rowId: existingRow.id }));
        // console.log('Test save (update) result:', { data, error });
      } else {
        // Insert a new row
        // console.log('INSERTING NEW TEST ROW');
        const newId = uuidv4();
        ({ data, error } = await supabase
          .from('stage_contents')
          .insert({
            id: newId,
            project_id: currentProjectId,
            stage_id: TEST_STAGE_ID,
            content_data: state.data as unknown as Json,
            created_at: new Date().toISOString(),
            created_by: userId,
          })
          .select());
        setState(prev => ({ ...prev, rowId: newId }));
        // console.log('Test save (insert) result:', { data, error });
      }
      if (error) throw error;
      setState(prev => ({ ...prev, isLoading: false, isDirty: false }));
      toast({
        title: 'Success',
        description: 'Test data saved successfully',
      });
      return { data, projectId: currentProjectId };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Error',
        description: 'Failed to save test data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    ...state,
    updateData,
    resetData,
    loadTest,
    saveTest,
    projectId,
  };
};
