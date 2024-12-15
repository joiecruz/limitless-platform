import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import AppRoutes from "./routes/AppRoutes";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      networkMode: 'always',
    },
  },
});

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          // Clear session and storage on error
          setSession(null);
          localStorage.clear(); // Clear all localStorage
          await supabase.auth.signOut();
          return;
        }

        if (!initialSession) {
          console.log("No initial session found");
          setSession(null);
          return;
        }

        // Refresh token if it's close to expiring
        const expiresAt = initialSession.expires_at;
        const timeNow = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = expiresAt - timeNow;
        
        if (timeUntilExpiry < 60) { // If less than 1 minute until expiry
          console.log("Session close to expiry, refreshing...");
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing session:", refreshError);
            setSession(null);
            localStorage.clear();
            await supabase.auth.signOut();
            return;
          }
          
          console.log("Session refreshed successfully");
          setSession(refreshedSession);
        } else {
          console.log("Initial session found and valid");
          setSession(initialSession);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        // Clear session and storage on error
        setSession(null);
        localStorage.clear();
        await supabase.auth.signOut();
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out - Clearing session and cache");
        setSession(null);
        queryClient.clear();
        localStorage.clear();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        return;
      }

      if (event === 'SIGNED_IN' && currentSession) {
        console.log("User signed in:", currentSession);
        setSession(currentSession);
        return;
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED' && currentSession) {
        console.log("Token refreshed:", currentSession);
        setSession(currentSession);
        return;
      }

      // Handle session expired
      if (event === 'USER_DELETED' || event === 'USER_UPDATED') {
        const { data: { session: newSession }, error } = await supabase.auth.getSession();
        if (error || !newSession) {
          console.log("Session invalid after user update - signing out");
          setSession(null);
          queryClient.clear();
          localStorage.clear();
          await supabase.auth.signOut();
          return;
        }
        setSession(newSession);
      }
    });

    // Set up periodic token refresh
    const refreshInterval = setInterval(async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (currentSession) {
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Error refreshing token:", refreshError);
        } else {
          console.log("Token refreshed successfully");
        }
      }
    }, 4 * 60 * 1000); // Refresh every 4 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [toast]);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes session={session} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;