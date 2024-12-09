import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id);
    };
    getCurrentUser();
  }, []);

  return currentUser;
}