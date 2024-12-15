import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Skip auth check for verify-email and signup pages
    if (location.pathname === '/verify-email' || location.pathname === '/signup') {
      setIsChecking(false);
      return;
    }

    const checkSession = async () => {
      try {
        console.log("🔍 Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("🚫 No session found");
          setIsAuthenticated(false);
          await supabase.auth.signOut();
          navigate("/signin", { replace: true });
          return;
        }

        console.log("📊 Session state:", {
          user: session.user.id,
          email: session.user.email,
          emailConfirmed: session.user.email_confirmed_at
        });

        // Handle pending workspace join after email verification
        const pendingWorkspaceJoin = localStorage.getItem('pendingWorkspaceJoin');
        if (pendingWorkspaceJoin && session.user.email_confirmed_at) {
          console.log("🏢 Processing pending workspace join:", pendingWorkspaceJoin);
          const { workspaceId, role, invitationId } = JSON.parse(pendingWorkspaceJoin);
          
          try {
            // Add user to workspace
            const { error: memberError } = await supabase
              .from("workspace_members")
              .insert({
                workspace_id: workspaceId,
                user_id: session.user.id,
                role: role
              });

            if (memberError) {
              if (memberError.code === '23505') {
                console.log("ℹ️ User already in workspace");
              } else {
                throw memberError;
              }
            }

            // Update invitation status
            const { error: inviteError } = await supabase
              .from("workspace_invitations")
              .update({ 
                status: "accepted",
                accepted_at: new Date().toISOString()
              })
              .eq("id", invitationId);

            if (inviteError) throw inviteError;

            console.log("✅ Workspace join completed");
            localStorage.removeItem('pendingWorkspaceJoin');
            
            // Redirect to workspace dashboard
            navigate(`/dashboard?workspace=${workspaceId}`);
            return;
          } catch (error: any) {
            console.error("❌ Error joining workspace:", error);
            toast({
              title: "Error",
              description: "Failed to join workspace",
              variant: "destructive",
            });
          }
        }

        if (!session.user.email_confirmed_at) {
          console.log("📧 Email not confirmed");
          setIsAuthenticated(false);
          navigate("/verify-email", { replace: true });
          return;
        }

        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error: any) {
        console.error("❌ Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        
        setIsAuthenticated(false);
        await supabase.auth.signOut();
        navigate("/signin", { replace: true });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth state changed:", { event, session });
      
      if (location.pathname === '/verify-email' || location.pathname === '/signup') {
        return;
      }

      if (!session) {
        setIsAuthenticated(false);
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        setIsAuthenticated(false);
        navigate("/verify-email", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (isChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}