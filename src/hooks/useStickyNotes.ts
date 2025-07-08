import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StickyNote } from '@/types/designChallenge';
import { useToast } from '@/hooks/use-toast';

const STICKY_COLORS = [
  '#FEF3C7', // yellow
  '#DBEAFE', // blue
  '#D1FAE5', // green
  '#FCE7F3', // pink
  '#E5E7EB', // gray
  '#F3E8FF', // purple
];

export const useStickyNotes = (challengeId: string | null) => {
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStickyNotes = async () => {
    if (!challengeId) return;

    try {
      const { data, error } = await supabase
        .from('sticky_notes')
        .select(`
          *,
          creator:profiles!sticky_notes_created_by_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStickyNotes(data || []);
    } catch (error) {
      console.error('Error fetching sticky notes:', error);
      toast({
        title: "Error",
        description: "Failed to load sticky notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStickyNote = async (content: string, x: number = 100, y: number = 100) => {
    if (!challengeId) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const randomColor = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];

      const { data, error } = await supabase
        .from('sticky_notes')
        .insert({
          content,
          position_x: x,
          position_y: y,
          color: randomColor,
          challenge_id: challengeId,
          created_by: user.id
        })
        .select(`
          *,
          creator:profiles!sticky_notes_created_by_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) throw error;

      // Don't update local state here - let real-time subscription handle it
      return data;
    } catch (error) {
      console.error('Error creating sticky note:', error);
      toast({
        title: "Error",
        description: "Failed to create sticky note",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStickyNotePosition = async (noteId: string, x: number, y: number) => {
    // Store original position for potential revert
    const originalNote = stickyNotes.find(note => note.id === noteId);
    if (!originalNote) return;
    
    try {
      // Optimistically update local state for immediate visual feedback
      setStickyNotes(prev =>
        prev.map(note =>
          note.id === noteId ? { ...note, position_x: x, position_y: y } : note
        )
      );

      const { error } = await supabase
        .from('sticky_notes')
        .update({ position_x: x, position_y: y })
        .eq('id', noteId);

      if (error) {
        // Revert optimistic update on error
        setStickyNotes(prev =>
          prev.map(note =>
            note.id === noteId 
              ? { ...note, position_x: originalNote.position_x, position_y: originalNote.position_y } 
              : note
          )
        );
        throw error;
      }
    } catch (error) {
      console.error('Error updating sticky note position:', error);
    }
  };

  const deleteStickyNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('sticky_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // Don't update local state here - let real-time subscription handle it
    } catch (error) {
      console.error('Error deleting sticky note:', error);
      toast({
        title: "Error",
        description: "Failed to delete sticky note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStickyNotes();

    if (!challengeId) return;

    // Subscribe to real-time updates for granular changes
    const channel = supabase
      .channel(`sticky_notes_${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sticky_notes',
          filter: `challenge_id=eq.${challengeId}`
        },
        async (payload) => {
          // Fetch the complete note with creator info
          const { data } = await supabase
            .from('sticky_notes')
            .select(`
              *,
              creator:profiles!sticky_notes_created_by_fkey(
                id,
                first_name,
                last_name,
                avatar_url,
                email
              )
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (data) {
            setStickyNotes(prev => {
              // Avoid duplicates
              if (prev.some(note => note.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sticky_notes',
          filter: `challenge_id=eq.${challengeId}`
        },
        (payload) => {
          setStickyNotes(prev =>
            prev.map(note =>
              note.id === payload.new.id
                ? { ...note, ...payload.new }
                : note
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'sticky_notes',
          filter: `challenge_id=eq.${challengeId}`
        },
        (payload) => {
          setStickyNotes(prev => prev.filter(note => note.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [challengeId]);

  return {
    stickyNotes,
    loading,
    createStickyNote,
    updateStickyNotePosition,
    deleteStickyNote,
    refetch: fetchStickyNotes
  };
};