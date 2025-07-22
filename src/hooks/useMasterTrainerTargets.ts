import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MasterTrainerTarget {
  id: string;
  user_id: string;
  hour_of_code_target: number;
  depth_training_target: number;
  hour_of_code_current: number;
  depth_training_current: number;
  created_at: string;
  updated_at: string;
}

export function useMasterTrainerTargets() {
  const [targets, setTargets] = useState<MasterTrainerTarget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTargets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First try to get existing targets
      const { data: existingTargets, error: fetchError } = await supabase
        .from('master_trainer_targets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingTargets) {
        setTargets(existingTargets);
      } else {
        // Create default targets for new user
        const { data: newTargets, error: insertError } = await supabase
          .from('master_trainer_targets')
          .insert([{
            user_id: user.id,
            hour_of_code_target: 3000,
            depth_training_target: 600,
            hour_of_code_current: 0,
            depth_training_current: 0
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setTargets(newTargets);
      }
    } catch (error) {
      console.error('Error fetching targets:', error);
      toast({
        title: "Error",
        description: "Failed to load targets data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTargets = async (hourOfCodeCurrent: number, depthTrainingCurrent: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !targets) return;

      const { error } = await supabase
        .from('master_trainer_targets')
        .update({
          hour_of_code_current: hourOfCodeCurrent,
          depth_training_current: depthTrainingCurrent,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setTargets({
        ...targets,
        hour_of_code_current: hourOfCodeCurrent,
        depth_training_current: depthTrainingCurrent,
      });
    } catch (error) {
      console.error('Error updating targets:', error);
      toast({
        title: "Error",
        description: "Failed to update targets",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  return {
    targets,
    isLoading,
    refetch: fetchTargets,
    updateTargets,
  };
}