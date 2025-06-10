import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GlobalRole {
  is_superadmin: boolean;
  is_admin: boolean;
}

export function useGlobalRole() {
  const [globalRole, setGlobalRole] = useState<GlobalRole>({ is_superadmin: false, is_admin: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setGlobalRole({ is_superadmin: false, is_admin: false });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_superadmin, is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching global role:', error);
          setGlobalRole({ is_superadmin: false, is_admin: false });
          return;
        }

        setGlobalRole({
          is_superadmin: !!profile?.is_superadmin,
          is_admin: !!profile?.is_admin
        });
      } catch (error) {
        console.error('Error in fetchGlobalRole:', error);
        setGlobalRole({ is_superadmin: false, is_admin: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalRole();
  }, []);

  const canManagePublicChannels = globalRole.is_superadmin || globalRole.is_admin;
  const canDeletePublicMessages = globalRole.is_superadmin || globalRole.is_admin;

  return {
    ...globalRole,
    canManagePublicChannels,
    canDeletePublicMessages,
    isLoading
  };
}