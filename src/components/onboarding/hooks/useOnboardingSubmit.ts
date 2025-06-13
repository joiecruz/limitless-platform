
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingData } from "../types";
import { useState } from "react";

interface UseOnboardingSubmitProps {
  onOpenChange?: (open: boolean) => void;
  workspaceId?: string;
  onSuccess?: () => void;
}

export const useOnboardingSubmit = (props: UseOnboardingSubmitProps = {}) => {
  const { onOpenChange, workspaceId, onSuccess } = props;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const submitOnboarding = async (data: OnboardingData) => {
    setLoading(true);
    try {
      console.log("Submitting onboarding data:", data);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("User not found");
      }

      console.log("Current user:", user);

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log("Existing profile:", existingProfile);

      // Update profile with onboarding data
      const profileUpdate = {
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        company_size: data.companySize,
        goals: Array.isArray(data.goals) ? data.goals.join(', ') : data.goals,
        referral_source: data.referralSource,
      };

      console.log("Profile update data:", profileUpdate);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          ...profileUpdate
        });

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      // Create workspace if provided
      if (data.workspaceName) {
        console.log("Creating workspace:", data.workspaceName);
        
        const workspaceSlug = data.workspaceName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const { data: workspace, error: workspaceError } = await supabase
          .from('workspaces')
          .insert({
            name: data.workspaceName,
            slug: workspaceSlug,
          })
          .select()
          .single();

        if (workspaceError) {
          console.error("Workspace creation error:", workspaceError);
          throw workspaceError;
        }

        console.log("Created workspace:", workspace);

        // Add user as owner of the workspace
        const { error: memberError } = await supabase
          .from('workspace_members')
          .insert({
            user_id: user.id,
            workspace_id: workspace.id,
            role: 'owner',
          });

        if (memberError) {
          console.error("Workspace member error:", memberError);
          throw memberError;
        }

        console.log("Added user as workspace owner");
      }

      // Track onboarding completion event
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          event_type: 'onboarding_completed',
          event_data: {
            goals: Array.isArray(data.goals) ? data.goals : [data.goals],
            referral_source: data.referralSource,
            has_workspace: !!data.workspaceName
          }
        });

      if (eventError) {
        console.error("Event tracking error:", eventError);
        // Don't throw here as it's not critical
      }

      console.log("Onboarding completed successfully");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal if onOpenChange is provided
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      return { success: true };

    } catch (error: any) {
      console.error("Onboarding submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit: submitOnboarding, loading };
};
