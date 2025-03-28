
import { useAuthRedirect } from "@/components/auth/useAuthRedirect";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthLinks } from "@/components/auth/AuthLinks";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/common/LoadingPage";
import { useToast } from "@/hooks/use-toast";
import { useSignInPageSEO } from "@/hooks/useSignInPageSEO";
import { SEO } from "@/components/common/SEO";

export default function SignIn() {
  useAuthRedirect();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply Sign In page-specific SEO
  useSignInPageSEO();

  // Query to check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setIsLoading(true);
          console.log("User authenticated, checking workspace membership...");
          
          const { data: memberData, error: memberError } = await supabase
            .from('workspace_members')
            .select(`
              workspace_id,
              workspaces:workspace_id (
                id,
                name
              )
            `)
            .eq('user_id', currentSession.user.id);

          if (memberError) {
            console.error("Error checking workspace membership:", memberError);
            toast({
              title: "Error",
              description: "There was a problem signing you in. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (!memberData || memberData.length === 0) {
            console.log("No workspace found, redirecting to onboarding...");
            navigate('/onboarding', { replace: true });
            return;
          }

          // Use the first workspace as default
          const workspace = memberData[0].workspaces as unknown as { id: string; name: string };
          console.log("Workspace found, redirecting to dashboard...", workspace);
          localStorage.setItem('selectedWorkspace', workspace.id);
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error("Error in auth change handler:", error);
        toast({
          title: "Error",
          description: "There was a problem signing you in. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthChange();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          const { data: memberData, error: memberError } = await supabase
            .from('workspace_members')
            .select(`
              workspace_id,
              workspaces:workspace_id (
                id,
                name
              )
            `)
            .eq('user_id', session.user.id);

          if (memberError) {
            console.error("Error handling sign in:", memberError);
            throw memberError;
          }

          if (!memberData || memberData.length === 0) {
            navigate('/onboarding', { replace: true });
            return;
          }

          const workspace = memberData[0].workspaces as unknown as { id: string; name: string };
          localStorage.setItem('selectedWorkspace', workspace.id);
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error("Error handling sign in:", error);
          toast({
            title: "Error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleLogoClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Sign in to Limitless Lab"
        description="Sign in to access Limitless Lab's comprehensive platform for learning, tools, and community."
        image="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/SEO%20-%20Metafata.png"
        canonical={`${window.location.origin}/signin`}
      />
      
      <div className="w-full max-w-md">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <AuthLogo />
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Where innovation meets possibility – your journey to limitless learning begins here
            </p>
          </div>

          <SignInForm />
          <AuthLinks />
        </div>
      </div>
    </div>
  );
}
