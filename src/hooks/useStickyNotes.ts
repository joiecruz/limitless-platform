
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StickyNote } from '@/types/designChallenge';
import { useToast } from '@/hooks/use-toast';

export function useStickyNotes(challengeId: string | null) {
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
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStickyNotes(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading sticky notes',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createStickyNote = async (content: string, position_x: number, position_y: number, color: string = '#FEF3C7') => {
    if (!challengeId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('sticky_notes')
        .insert({
          content,
          position_x,
          position_y,
          color,
          challenge_id: challengeId,
          created_by: user.id,
        });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error creating sticky note',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateStickyNotePosition = async (noteId: string, position_x: number, position_y: number) => {
    try {
      const { error } = await supabase
        .from('sticky_notes')
        .update({ position_x, position_y })
        .eq('id', noteId);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error updating position',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteStickyNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('sticky_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error deleting sticky note',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!challengeId) return;

    fetchStickyNotes();

    const channel = supabase
      .channel('sticky-notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sticky_notes',
          filter: `challenge_id=eq.${challengeId}`,
        },
        () => {
          fetchStickyNotes();
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
  };
}
