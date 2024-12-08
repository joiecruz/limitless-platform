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

const queryClient = new QueryClient();

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
          localStorage.clear(); // Clear all local storage
          await supabase.auth.signOut();
          return;
        }

        if (!initialSession) {
          console.log("No initial session found");
          setSession(null);
          return;
        }

        console.log("Initial session found:", initialSession);
        setSession(initialSession);
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        // Clear session and storage on error
        setSession(null);
        localStorage.clear(); // Clear all local storage
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
        // Clear session and cached data
        setSession(null);
        queryClient.clear();
        localStorage.clear(); // Clear all local storage
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

      // Update session for other events
      setSession(currentSession);
    });

    return () => {
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
          <AppRoutes session={session} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;