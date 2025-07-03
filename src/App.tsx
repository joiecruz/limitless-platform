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
      

      // Check if we're in a password recovery context
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const isPasswordRecovery = urlParams.get('type') === 'recovery' || hashParams.get('type') === 'recovery';

      if (isPasswordRecovery) {
        
        setSession(null);
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
        
        setSession(null);
        localStorage.removeItem('selectedWorkspace');
        return;
      }

      if (!initialSession) {
        
        setSession(null);
        return;
      }

      
      setSession(initialSession);
    } catch (error) {
      
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If we're on apex domain, don't try loading the app yet
    if (isApexDomain() && !sessionStorage.getItem('apex_redirect_attempted')) {
      
      return;
    }

    let mounted = true;
    let sessionTimeoutId: number;

    // Clear any previous timeouts
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
    }

    // Set a timeout to force-complete loading regardless of session status
    sessionTimeoutId = window.setTimeout(() => {
      
      if (mounted) {
        setLoading(false);
      }
    }, 6000) as unknown as number;

    getInitialSession();

    // Listen for auth changes (including password recovery events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      

      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        
        // Don't set session or sign in the user during password recovery
        // Let them proceed to the reset password page without authentication
        return;
      }

      if (event === 'TOKEN_REFRESHED' && !currentSession) {
        
        setSession(null);
        queryClient.clear();
        localStorage.removeItem('selectedWorkspace');
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
        });
        return;
      }

      if (event === 'SIGNED_OUT') {
        
        setSession(null);
        queryClient.clear();
        localStorage.removeItem('selectedWorkspace');
        return;
      }

      if (event === 'SIGNED_IN' && currentSession) {
        
        setSession(currentSession);
        return;
      }

      if (event === 'TOKEN_REFRESHED' && currentSession) {
        
        setSession(currentSession);
        return;
      }

      if (event === 'USER_UPDATED' && currentSession) {
        
        // Don't set session, show success toast
        setSession(null);
        queryClient.clear();
        localStorage.removeItem('selectedWorkspace');
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully. Please sign in with your new password.",
        });
        return;
      }
    });

    return () => {
      mounted = false;
      if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
      }
      subscription.unsubscribe();
    };
  }, [toast, getInitialSession]);

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
