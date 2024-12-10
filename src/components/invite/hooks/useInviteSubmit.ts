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
      // Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          company_size: data.companySize,
          goals: data.goals,
          referral_source: data.referralSource,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      if (onOpenChange) {
        onOpenChange(false);
      }

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
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