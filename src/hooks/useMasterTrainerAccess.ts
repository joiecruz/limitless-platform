import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMasterTrainerAccess() {
  const [hasMasterTrainerAccess, setHasMasterTrainerAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasMasterTrainerAccess(false);
          return;
        }

        // Check if user is superadmin first
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_superadmin')
          .eq('id', user.id)
          .single();

        if (profile?.is_superadmin) {
          setHasMasterTrainerAccess(true);
          return;
        }

        // Check for master trainer access
        const { data: access } = await supabase
          .from('master_trainer_access')
          .select('id')
          .eq('user_id', user.id)
          .single();

        setHasMasterTrainerAccess(!!access);
      } catch (error) {
        setHasMasterTrainerAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  return { hasMasterTrainerAccess, isLoading };
}