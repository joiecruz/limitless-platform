import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import AppRoutes from "./routes/AppRoutes";
import { useToast } from "@/hooks/use-toast";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import { isApexDomain } from "./utils/domainHelpers";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Create optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'always',
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Create a helmet context
const helmetContext = {};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if we're on the reset password page
  const isResetPasswordPage = window.location.pathname.includes('/reset-password');

  // Memoize the getInitialSession function to avoid recreation on each render
  const getInitialSession = useCallback(async () => {
    try {
      console.log("Getting initial session...");

      // If on reset password page, we still need to check for token in URL
      if (isResetPasswordPage) {
        console.log("On reset password page, checking for token");
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('token');

        if (accessToken) {
          try {
            // Try to set the session using the token from URL
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: '',
            });

            if (error) {
              console.error("Error setting session from token:", error);
            } else {
              console.log("Session set from reset password token");
              const { data } = await supabase.auth.getSession();
              setSession(data.session);
            }
          } catch (error) {
            console.error("Error setting session from token:", error);
          }
        }
        setLoading(false);
        return;
      }

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
        setSession(null);
        localStorage.removeItem('selectedWorkspace');
        return;
      }

      if (!initialSession) {
        console.log("No initial session found");
        setSession(null);
        return;
      }

      console.log("Initial session found and valid");
      setSession(initialSession);
    } catch (error) {
      console.error("Error in getInitialSession:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [isResetPasswordPage]);

  useEffect(() => {
    // If we're on apex domain, don't try loading the app yet
    if (isApexDomain() && !sessionStorage.getItem('apex_redirect_attempted')) {
      console.log("App - On apex domain, waiting for redirect to complete");
      return;
    }

    let mounted = true;
    let sessionTimeoutId: number;

    // Clear any previous timeouts
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
    }

    // Set a timeout to force-complete loading regardless of session status
    // Skip timeout if on reset password page
    if (!isResetPasswordPage) {
      sessionTimeoutId = window.setTimeout(() => {
        console.log("Session check timed out, continuing with app initialization");
        if (mounted) {
          setLoading(false);
        }
      }, 6000) as unknown as number;
    }

    getInitialSession();

    // Listen for auth changes (even on reset password page)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);

      if (!mounted) return;

      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !currentSession)) {
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
  }, [toast, getInitialSession, isResetPasswordPage]);

  // Show a simple loading indicator if still initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <LoadingSpinner size="md" className="border-t-2 border-b-2 border-[#393CA0]" />
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
