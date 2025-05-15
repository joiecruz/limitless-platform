
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
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import { isApexDomain } from "./utils/domainHelpers";

// Create a new query client with more aggressive retry settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'always',
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create a helmet context
const helmetContext = {};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If we're on apex domain, don't try loading the app yet
    // The redirect in main.tsx will handle it
    if (isApexDomain() && !sessionStorage.getItem('apex_redirect_attempted')) {
      console.log("App - On apex domain, waiting for redirect to complete");
      return;
    }

    let mounted = true;
    let sessionTimeoutId: number;

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");

        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session fetch timeout")), 5000)
        );

        const { data: { session: initialSession }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as Awaited<typeof sessionPromise>;

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setSession(null);
            localStorage.removeItem('selectedWorkspace');
          }
          return;
        }

        if (!initialSession) {
          console.log("No initial session found");
          if (mounted) {
            setSession(null);
          }
          return;
        }

        if (mounted) {
          console.log("Initial session found and valid");
          setSession(initialSession);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Clear any previous timeouts
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
    }

    // Set a timeout to force-complete loading regardless of session status
    sessionTimeoutId = window.setTimeout(() => {
      console.log("Session check timed out, continuing with app initialization");
      if (mounted) {
        setLoading(false);
      }
    }, 6000) as unknown as number;

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);

      if (!mounted) return;

      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !currentSession) {
        console.log("User signed out or token refresh failed - Clearing session and cache");
        setSession(null);
        queryClient.clear();
        localStorage.removeItem('selectedWorkspace');
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
        });
        return;
      }

      if (event === 'SIGNED_IN' && currentSession) {
        console.log("User signed in:", currentSession);
        setSession(currentSession);

        // Add user to systeme.io mailing list - don't await
        setTimeout(() => {
          console.log("Calling systeme-signup function for user:", currentSession.user.id);
          supabase.functions.invoke('handle-systeme-signup', {
            body: { user_id: currentSession.user.id }
          }).catch(error => {
            console.error('Mailing list error:', error);
          });
        }, 0);
        return;
      }

      if (event === 'TOKEN_REFRESHED' && currentSession) {
        console.log("Token refreshed:", currentSession);
        setSession(currentSession);
        return;
      }

      if (event === 'USER_UPDATED' && currentSession) {
        console.log("User updated:", currentSession);
        setSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
      }
      subscription.unsubscribe();
    };
  }, [toast]);

  // Show a simple loading indicator if still initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#393CA0]"></div>
      </div>
    );
  }

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes session={session} />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
