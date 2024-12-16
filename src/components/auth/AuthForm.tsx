import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { authConfig } from "./AuthConfig";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function AuthForm() {
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("AuthForm - Sign in successful:", session);
      }

      // Handle specific error cases
      if (event === "USER_UPDATED" && !session?.user.email_confirmed_at) {
        console.log("AuthForm - Email not confirmed");
        toast({
          title: "Email Verification Required",
          description: "Please check your email and click the confirmation link to continue.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleError = (error: Error) => {
    console.error("AuthForm - Authentication error:", error);
    
    // Handle specific error messages
    if (error.message.includes("Invalid login credentials")) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } else if (error.message.includes("Email not confirmed")) {
      toast({
        title: "Email Not Verified",
        description: "Please check your email and click the confirmation link to continue.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Authentication Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Auth
      supabaseClient={supabase}
      {...authConfig}
      theme="default"
      providers={[]}
      redirectTo={`${window.location.origin}/dashboard`}
      showLinks={false}
      onError={handleError}
    />
  );
}