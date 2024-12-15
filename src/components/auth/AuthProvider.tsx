import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useWorkspaceJoin } from "@/components/verify-email/useWorkspaceJoin";

interface AuthProviderProps {
  session: Session | null;
}

export function AuthProvider({ session }: AuthProviderProps) {
  const navigate = useNavigate();
  const { joinWorkspace } = useWorkspaceJoin();

  useEffect(() => {
    const handleSession = async () => {
      if (session) {
        // Check if this is a post-verification session
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('type') === 'signup') {
          console.log("Post-verification session detected in AuthProvider, attempting to join workspace...");
          await joinWorkspace(session);
        }
      }
    };

    handleSession();
  }, [session, joinWorkspace]);

  return null;
}