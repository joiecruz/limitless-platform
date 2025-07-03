
import { useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DesignChallenge, ChallengeStatus } from '@/types/designChallenge';
import { WorkspaceContext } from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

export function useDesignChallenges() {
  const [challenges, setChallenges] = useState<DesignChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { toast } = useToast();

  const fetchChallenges = async () => {
    if (!currentWorkspace?.id) return;

    try {
      const { data, error } = await supabase
        .from('design_challenges')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading challenges',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (title: string, description: string) => {
    if (!currentWorkspace?.id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('design_challenges')
        .insert({
          title,
          description,
          workspace_id: currentWorkspace.id,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Challenge created',
        description: 'Your design challenge has been created successfully.',
      });

      fetchChallenges();
    } catch (error: any) {
      toast({
        title: 'Error creating challenge',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateChallengeStatus = async (challengeId: string, status: ChallengeStatus) => {
    try {
      const { error } = await supabase
        .from('design_challenges')
        .update({ status })
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: 'Status updated',
        description: 'Challenge status has been updated.',
      });

      fetchChallenges();
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('design_challenges')
        .delete()
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: 'Challenge deleted',
        description: 'The challenge has been deleted.',
      });

      fetchChallenges();
    } catch (error: any) {
      toast({
        title: 'Error deleting challenge',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [currentWorkspace?.id]);

  return {
    challenges,
    loading,
    createChallenge,
    updateChallengeStatus,
    deleteChallenge,
    refetch: fetchChallenges,
  };
}
