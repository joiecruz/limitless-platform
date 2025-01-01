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
    let mounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setSession(null);
            localStorage.clear();
            await supabase.auth.signOut();
          }
          return;
        }

        // Handle domain redirects based on authentication state
        const currentDomain = window.location.hostname;
        const isAppDomain = currentDomain === 'app.limitlesslab.org';
        const isMainDomain = currentDomain === 'limitlesslab.org' || currentDomain === 'www.limitlesslab.org';
        const currentPath = window.location.pathname;

        // If authenticated
        if (initialSession?.user) {
          console.log("User is authenticated");
          
          // If on main domain and authenticated, redirect to app domain
          if (isMainDomain && currentPath !== '/signin') {
            console.log("Redirecting authenticated user from main to app domain");
            window.location.href = `https://app.limitlesslab.org${currentPath}`;
            return;
          }

          if (mounted) {
            setSession(initialSession);
          }
        } 
        // If not authenticated
        else {
          console.log("User is not authenticated");
          
          // If on app domain and not authenticated, redirect to main domain
          if (isAppDomain && currentPath !== '/signin') {
            console.log("Redirecting unauthenticated user from app to main domain");
            window.location.href = `https://limitlesslab.org${currentPath}`;
            return;
          }

          if (mounted) {
            setSession(null);
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setSession(null);
          localStorage.clear();
          await supabase.auth.signOut();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (!mounted) return;

      const currentDomain = window.location.hostname;
      const isAppDomain = currentDomain === 'app.limitlesslab.org';
      const isMainDomain = currentDomain === 'limitlesslab.org' || currentDomain === 'www.limitlesslab.org';
      const currentPath = window.location.pathname;

      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setSession(null);
        queryClient.clear();
        localStorage.clear();
        
        // Redirect to main domain if on app domain
        if (isAppDomain) {
          window.location.href = `https://limitlesslab.org/signin`;
        }
        
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        return;
      }

      if (event === 'SIGNED_IN' && currentSession) {
        console.log("User signed in");
        
        // If on main domain, redirect to app domain
        if (isMainDomain) {
          window.location.href = `https://app.limitlesslab.org/dashboard`;
          return;
        }
        
        setSession(currentSession);
        return;
      }

      if ((event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && currentSession) {
        setSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
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
          <ScrollToTop />
          <AppRoutes session={session} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;