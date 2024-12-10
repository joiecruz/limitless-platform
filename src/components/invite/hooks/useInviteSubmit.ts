import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingData } from "../../onboarding/types";

interface UseInviteSubmitProps {
  onOpenChange?: (open: boolean) => void;
}

export function useInviteSubmit({ onOpenChange }: UseInviteSubmitProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: OnboardingData) => {
    setLoading(true);
    try {
      // Get the invite details from URL params
      const params = new URLSearchParams(window.location.search);
      const email = params.get('email');
      const workspaceId = params.get('workspace');
      const role = params.get('role');

      if (!email || !workspaceId || !role) {
        throw new Error("Invalid invitation link");
      }

      // Create the auth account
      const { error: signUpError } = await supabase.auth.signUp({
        email: decodeURIComponent(email),
        password: data.password,
      });

      if (signUpError) throw signUpError;

      // Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          goals: data.goals,
          referral_source: data.referralSource,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      // Add user to workspace
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: role
        });

      if (memberError) throw memberError;

      if (onOpenChange) {
        onOpenChange(false);
      }

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully. Please check your email to verify your account.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error in invite submit:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
}