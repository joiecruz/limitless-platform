import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Json } from '@/integrations/supabase/types';

export interface UploadedPrototype {
  id: string;
  name: string;
  image: string;
}

export interface PrototypeData {
  selectedPrototypeTypes: string[];
  prototypeNotes: string;
  uploadedPrototypes: UploadedPrototype[];
}

export interface PrototypeState {
  data: PrototypeData;
  isLoading: boolean;
  isDirty: boolean;
  rowId: string | null;
}

const initialData: PrototypeData = {
  selectedPrototypeTypes: [],
  prototypeNotes: '',
  uploadedPrototypes: [],
};

// Prototype stage_id for Design Thinking (replace with your actual Prototype stage UUID)
const PROTOTYPE_STAGE_ID = '660e8400-e29b-41d4-a716-446655440004';

// Helper to check if all required fields are filled
function allFieldsFilled(data: PrototypeData) {
  return [
    Array.isArray(data.selectedPrototypeTypes) && data.selectedPrototypeTypes.length > 0,
    typeof data.prototypeNotes === 'string' && data.prototypeNotes.trim() !== '',
    Array.isArray(data.uploadedPrototypes) && data.uploadedPrototypes.length > 0
  ].every(Boolean);
}

export const usePrototype = (projectIdProp: string | null) => {
  const [state, setState] = useState<PrototypeState>({
    data: initialData,
    isLoading: false,
    isDirty: false,
    rowId: null,
  });
  const [projectId, setProjectId] = useState<string | null>(projectIdProp);
  const { toast } = useToast();

  const updateData = (updates: Partial<PrototypeData>) => {
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

  const loadPrototype = async () => {
    if (!projectId) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('stage_contents')
        .select('*')
        .eq('project_id', projectId)
        .eq('stage_id', PROTOTYPE_STAGE_ID)
        .maybeSingle();
      if (error) throw error;
      if (data && data.project_id === projectId && data.stage_id === PROTOTYPE_STAGE_ID) {
        let structure: PrototypeData = initialData;
        if (
          data.content_data &&
          typeof data.content_data === 'object' &&
          !Array.isArray(data.content_data)
        ) {
          structure = data.content_data as unknown as PrototypeData;
        }
        setState({
          data: structure,
          isLoading: false,
          isDirty: false,
          rowId: data.id,
        });
        // console.log('Loaded existing Prototype data for project_id and stage_id:', data);
        return structure;
      } else {
        setState(prev => ({ ...prev, isLoading: false, rowId: null }));
        // console.log('No existing Prototype data for project_id and stage_id, using initialData');
        return initialData;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load prototype data',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      return initialData;
    }
  };

  const savePrototype = async () => {
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
        .eq('stage_id', PROTOTYPE_STAGE_ID)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (existingRow && existingRow.id) {
        // Update the existing row using the DB id
        // console.log('UPDATING EXISTING PROTOTYPE ROW', existingRow.id);
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
        // console.log('Prototype save (update) result:', { data, error });
      } else {
        // Insert a new row
        // console.log('INSERTING NEW PROTOTYPE ROW');
        const newId = uuidv4();
        ({ data, error } = await supabase
          .from('stage_contents')
          .insert({
            id: newId,
            project_id: currentProjectId,
            stage_id: PROTOTYPE_STAGE_ID,
            content_data: state.data as unknown as Json,
            created_at: new Date().toISOString(),
            created_by: userId,
          })
          .select());
        setState(prev => ({ ...prev, rowId: newId }));
        // console.log('Prototype save (insert) result:', { data, error });
      }
      if (error) throw error;
      setState(prev => ({ ...prev, isLoading: false, isDirty: false }));
      toast({
        title: 'Success',
        description: 'Prototype data saved successfully',
      });
      // --- Check and update isCompletePrototype in metadata ---
      if (allFieldsFilled(state.data) && currentProjectId) {
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
          if (!metadata.isCompletePrototype) {
            await supabase
              .from('projects')
              .update({ metadata: { ...metadata, isCompletePrototype: true } })
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
        description: 'Failed to save prototype data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    ...state,
    updateData,
    resetData,
    loadPrototype,
    savePrototype,
    projectId,
  };
};
