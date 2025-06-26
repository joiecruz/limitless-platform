
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        },
        error
      } = await supabase.auth.getSession();
      if (error || !session) {
        navigate("/signin", {
          replace: true
        });
        return;
      }
    };
    checkAuth();
  }, [navigate]);
}
