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
import { OutsetaChat } from "@/components/common/OutsetaChat";

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
        console.log("Getting initial session...");
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
      console.log("Auth state changed:", event, currentSession);
      
      if (!mounted) return;

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
          <OutsetaChat />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;