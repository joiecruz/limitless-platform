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
    const handleSessionError = async () => {
      console.log("Handling session error - clearing session and storage");
      setSession(null);
      queryClient.clear();
      localStorage.clear();
      await supabase.auth.signOut();
      toast({
        title: "Session Error",
        description: "Please sign in again",
        variant: "destructive",
      });
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          await handleSessionError();
          return;
        }

        if (!initialSession) {
          console.log("No initial session found");
          setSession(null);
          return;
        }

        // Validate session
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Error validating user:", userError);
          await handleSessionError();
          return;
        }

        console.log("Session validated successfully");
        setSession(initialSession);
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        await handleSessionError();
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
        await handleSessionError();
        return;
      }

      if (event === 'SIGNED_IN' && currentSession) {
        try {
          // Validate session
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.error("Error validating user after sign in:", userError);
            await handleSessionError();
            return;
          }

          console.log("User signed in:", currentSession);
          setSession(currentSession);
        } catch (error) {
          console.error("Error handling sign in:", error);
          await handleSessionError();
        }
        return;
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED' && currentSession) {
        console.log("Token refreshed:", currentSession);
        setSession(currentSession);
        return;
      }

      // Handle user updates
      if (event === 'USER_UPDATED' && currentSession) {
        try {
          const { data: { session: newSession }, error } = await supabase.auth.getSession();
          if (error || !newSession) {
            console.log("Session invalid after user update - signing out");
            await handleSessionError();
            return;
          }
          setSession(newSession);
        } catch (error) {
          console.error("Error handling user update:", error);
          await handleSessionError();
        }
      }
    });

    // Set up periodic session validation
    const validationInterval = setInterval(async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Session validation failed:", userError);
          await handleSessionError();
        }
      } catch (error) {
        console.error("Error in session validation:", error);
        await handleSessionError();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(validationInterval);
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