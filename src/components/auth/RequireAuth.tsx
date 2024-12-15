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
        console.log("🔍 RequireAuth: Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ RequireAuth: Session error:", sessionError);
          throw sessionError;
        }

        console.log("📊 RequireAuth: Session state:", {
          session: session?.user?.id,
          email: session?.user?.email,
          emailConfirmed: session?.user?.email_confirmed_at,
          timestamp: new Date().toISOString()
        });
        
        if (!session) {
          console.log("🚫 RequireAuth: No session found, redirecting to signin");
          setIsAuthenticated(false);
          await supabase.auth.signOut(); // Force clean session state
          navigate("/signin", { replace: true });
          return;
        }

        // Check for pending workspace join after email verification
        const pendingWorkspaceJoin = localStorage.getItem('pendingWorkspaceJoin');
        if (pendingWorkspaceJoin && session.user.email_confirmed_at) {
          console.log("🏢 RequireAuth: Found pending workspace join:", pendingWorkspaceJoin);
          const { workspaceId, role, invitationId } = JSON.parse(pendingWorkspaceJoin);
          
          try {
            console.log("➕ RequireAuth: Adding user to workspace:", {
              workspace: workspaceId,
              role: role,
              user: session.user.id
            });

            // Add user to workspace
            const { error: memberError } = await supabase
              .from("workspace_members")
              .insert({
                workspace_id: workspaceId,
                user_id: session.user.id,
                role: role
              });

            if (memberError) {
              if (memberError.code === '23505') { // Unique violation
                console.log("ℹ️ User is already a member of this workspace");
              } else {
                console.error("❌ Error adding member:", memberError);
                throw memberError;
              }
            }

            // Update invitation status
            console.log("📝 RequireAuth: Updating invitation status...");
            const { error: inviteError } = await supabase
              .from("workspace_invitations")
              .update({ 
                status: "accepted",
                accepted_at: new Date().toISOString()
              })
              .eq("id", invitationId);

            if (inviteError) {
              console.error("❌ Error updating invitation:", inviteError);
              throw inviteError;
            }

            console.log("✅ RequireAuth: Workspace join completed successfully");
            localStorage.removeItem('pendingWorkspaceJoin');
            navigate(`/dashboard?workspace=${workspaceId}`);
            return;
          } catch (error: any) {
            console.error("❌ Error joining workspace:", error);
            toast({
              title: "Error",
              description: error.message || "Failed to join workspace",
              variant: "destructive",
            });
          }
        }

        if (!session.user.email_confirmed_at) {
          console.log("📧 RequireAuth: Email not confirmed, redirecting to verify-email");
          setIsAuthenticated(false);
          navigate("/verify-email", { replace: true });
          return;
        }

        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error: any) {
        console.error("❌ RequireAuth: Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        
        setIsAuthenticated(false);
        // Force clean session state and redirect
        await supabase.auth.signOut();
        navigate("/signin", { replace: true });
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 RequireAuth: Auth state changed:", {
        event,
        user: session?.user?.id,
        email: session?.user?.email,
        timestamp: new Date().toISOString()
      });
      
      // Skip auth redirects for verify-email and signup pages
      if (location.pathname === '/verify-email' || location.pathname === '/signup') {
        return;
      }

      if (!session) {
        console.log("🚫 RequireAuth: Session lost, redirecting to signin");
        setIsAuthenticated(false);
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        console.log("📧 RequireAuth: Email not confirmed, redirecting to verify-email");
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
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    // Redirect to signin while preserving the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}