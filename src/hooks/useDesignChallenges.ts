import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DesignChallenge, ChallengeStatus } from '@/types/designChallenge';
import { useToast } from '@/hooks/use-toast';

export const useDesignChallenges = (workspaceId: string | null) => {
  const [challenges, setChallenges] = useState<DesignChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChallenges = async () => {
    if (!workspaceId) return;

    try {
      const { data, error } = await supabase
        .from('design_challenges')
        .select(`
          *,
          creator:profiles!design_challenges_created_by_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (title: string, description: string) => {
    if (!workspaceId) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('design_challenges')
        .insert({
          title,
          description,
          workspace_id: workspaceId,
          created_by: user.id,
          category: 'DT',
          status: 'in_progress'
        })
        .select(`
          *,
          creator:profiles!design_challenges_created_by_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) throw error;

      setChallenges(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Challenge created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateChallengeStatus = async (challengeId: string, status: ChallengeStatus) => {
    try {
      const { error } = await supabase
        .from('design_challenges')
        .update({ status })
        .eq('id', challengeId);

      if (error) throw error;

      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId ? { ...challenge, status } : challenge
        )
      );

      toast({
        title: "Success",
        description: "Challenge status updated",
      });
    } catch (error) {
      console.error('Error updating challenge status:', error);
      toast({
        title: "Error",
        description: "Failed to update challenge status",
        variant: "destructive",
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

      setChallenges(prev => prev.filter(challenge => challenge.id !== challengeId));
      toast({
        title: "Success",
        description: "Challenge deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast({
        title: "Error",
        description: "Failed to delete challenge",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchChallenges();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('design_challenges_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'design_challenges',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => {
          fetchChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  return {
    challenges,
    loading,
    createChallenge,
    updateChallengeStatus,
    deleteChallenge,
    refetch: fetchChallenges
  };
};