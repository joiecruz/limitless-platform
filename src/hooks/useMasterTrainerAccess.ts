
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalRole } from "@/hooks/useGlobalRole";

export function useMasterTrainerAccess() {
  const [hasMasterTrainerAccess, setHasMasterTrainerAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { is_superadmin } = useGlobalRole();

  useEffect(() => {
    const checkMasterTrainerAccess = async () => {
      try {
        // If user is superadmin, they automatically have access
        if (is_superadmin) {
          setHasMasterTrainerAccess(true);
          setIsLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasMasterTrainerAccess(false);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('master_trainer_access')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking master trainer access:', error);
          setHasMasterTrainerAccess(false);
        } else {
          setHasMasterTrainerAccess(!!data);
        }
      } catch (error) {
        console.error('Error checking master trainer access:', error);
        setHasMasterTrainerAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMasterTrainerAccess();
  }, [is_superadmin]);

  return {
    hasMasterTrainerAccess,
    isLoading
  };
}
