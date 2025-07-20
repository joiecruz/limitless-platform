import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Json } from '@/integrations/supabase/types';

export interface IdeateNote {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  color: string;
  is_favorite: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface IdeateData {
  instructions: string;
  question: string;
  summary?: string;
  notes?: IdeateNote[];
}

interface IdeateState {
  data: IdeateData;
  isLoading: boolean;
  isDirty: boolean;
  rowId: string | null;
}

const initialData: IdeateData = {
  instructions: '',
  question: '',
  summary: '',
};

export const IDEATE_STAGE_ID = '660e8400-e29b-41d4-a716-446655440004';

export const useIdeate = (projectIdProp: string | null) => {
  const [state, setState] = useState<IdeateState>({
    data: initialData,
    isLoading: false,
    isDirty: false,
    rowId: null,
  });
  const [projectId, setProjectId] = useState<string | null>(projectIdProp);
  const { toast } = useToast();

  const updateData = (updates: Partial<IdeateData>, callback?: () => void) => {
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

  const loadIdeate = async () => {
    if (!projectId) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('stage_contents')
        .select('*')
        .eq('project_id', projectId)
        .eq('stage_id', IDEATE_STAGE_ID)
        .maybeSingle();
      if (error) throw error;
      if (data && data.project_id === projectId && data.stage_id === IDEATE_STAGE_ID) {
        let structure: IdeateData = initialData;
        if (
          data.content_data &&
          typeof data.content_data === 'object' &&
          !Array.isArray(data.content_data)
        ) {
          structure = data.content_data as unknown as IdeateData;
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
        description: 'Failed to load ideate data',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
      return initialData;
    }
  };

  // Generate ideas using Supabase Edge Function
  const generateIdeas = async (projectContext: {
    projectName: string;
    projectDescription?: string;
    projectProblem?: string;
    projectCustomers?: string;
    targetOutcomes?: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-ideas', {
        body: projectContext
      });
      if (error) throw new Error(`Edge function error: ${error.message}`);
      if (data?.ideas && Array.isArray(data.ideas)) {
        // Save generated ideas to ideate data (e.g., as summary or ideas array)
        let newData: IdeateData = {
          ...state.data,
          summary: data.ideas.join('\n'),
          // Optionally, add ideas: data.ideas
        };
        setState(prev => ({ ...prev, data: newData, isLoading: false, isDirty: true }));
        await saveIdeate(newData);
        toast({
          title: 'Ideas Generated',
          description: 'AI has generated new ideas for your project.',
        });
        return data.ideas;
      } else {
        throw new Error('Invalid ideas data received from edge function');
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Generation Failed',
        description: error?.message || 'Failed to generate ideas. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Get notes
  const getNotes = () =>
    (state.data.notes || []).map(n => ({
      ...n,
      position: (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number')
        ? n.position
        : { x: 100, y: 100 }
    }));

  // Add note
  const addNote = async (note: Omit<IdeateNote, 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const safePosition = (note.position && typeof note.position.x === 'number' && typeof note.position.y === 'number')
      ? note.position
      : { x: 100, y: 100 };
    const newNote: IdeateNote = { ...note, position: safePosition, created_at: now, updated_at: now };
    const notes = [...getNotes(), newNote];
    updateData({ notes });
    await saveIdeate({ ...state.data, notes });
    return newNote;
  };

  // Update note
  const updateNote = async (id: string, updates: Partial<IdeateNote>) => {
    const notes = getNotes().map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n);
    updateData({ notes });
    await saveIdeate({ ...state.data, notes });
  };

  // Delete note
  const deleteNote = async (id: string) => {
    const notes = getNotes().filter(n => n.id !== id);
    updateData({ notes });
    await saveIdeate({ ...state.data, notes });
  };

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const notes = getNotes().map(n => n.id === id ? { ...n, is_favorite: !n.is_favorite, updated_at: new Date().toISOString() } : n);
    updateData({ notes });
    await saveIdeate({ ...state.data, notes });
  };

  // Move note (update position)
  const moveNote = async (id: string, x: number, y: number) => {
    const notes = getNotes().map(n =>
      n.id === id
        ? { ...n, position: { x: typeof x === 'number' ? x : 100, y: typeof y === 'number' ? y : 100 }, updated_at: new Date().toISOString() }
        : n
    );
    updateData({ notes });
    try {
      await saveIdeate({ ...state.data, notes }, false);
    } catch (err) {
      // Optionally, revert local state or show error
      // You could reload notes from DB here if you want to revert
      console.error('Failed to persist note position:', err);
    }
  };

  const saveIdeate = async (dataOverride?: IdeateData, showToast: boolean = true) => {
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
        .eq('stage_id', IDEATE_STAGE_ID)
        .maybeSingle();
      if (fetchError) throw fetchError;
      const contentData = dataOverride || state.data;
      // console.log('Saving to DB:', contentData.notes); // Debug log
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
            stage_id: IDEATE_STAGE_ID,
            content_data: contentData as unknown as Json,
            created_at: new Date().toISOString(),
            created_by: userId,
          })
          .select());
        setState(prev => ({ ...prev, rowId: newId }));
      }
      if (error) throw error;
      setState(prev => ({ ...prev, isLoading: false, isDirty: false }));
      if (showToast) {
        toast({
          title: 'Success',
          description: 'Ideate data saved successfully',
        });
      }
      return { data, projectId: currentProjectId };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Error',
        description: 'Failed to save ideate data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    ...state,
    updateData,
    resetData,
    loadIdeate,
    saveIdeate,
    generateIdeas,
    getNotes,
    addNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    moveNote,
    projectId,
    isDirty: state.isDirty,
  };
}; 