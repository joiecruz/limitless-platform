import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CoCreationSession {
  id: string;
  title: string;
  description: string | null;
  status: string;
  slug: string | null;
  workspace_id: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useCoCreationSessions = (workspaceId: string | null) => {
  const [sessions, setSessions] = useState<CoCreationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!workspaceId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('cocreation_sessions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSessions((data || []) as CoCreationSession[]);
    } catch (e) {
      console.error('Error fetching co-creation sessions:', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase.from('cocreation_sessions').delete().eq('id', id);
      if (error) throw error;
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: 'Deleted', description: 'Co-creation session removed.' });
    } catch (e: any) {
      console.error('Error deleting co-creation session:', e);
      toast({ title: 'Error', description: 'Failed to delete session', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchSessions();
    if (!workspaceId) return;
    const channel = supabase
      .channel(`cocreation_sessions_${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cocreation_sessions', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchSessions(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  return { sessions, loading, deleteSession, refetch: fetchSessions };
};
