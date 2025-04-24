
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { OnboardingData } from "../types";
import { useLocation } from "react-router-dom";

interface OnboardingSubmitProps {
  onOpenChange?: (open: boolean) => void;
  workspaceId?: string;
  onSuccess?: () => void;
}

export function useOnboardingSubmit({ onOpenChange, workspaceId, onSuccess }: OnboardingSubmitProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isInvitedUser = location.state?.isInvited;

  const handleSubmit = async (formData: OnboardingData) => {
    console.log('Starting onboarding submission with data:', formData);
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        console.error('Error getting user:', userError);
        throw new Error("No user found");
      }

      console.log('Got user:', user.id);

      // First, check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
        // If profile doesn't exist, create it
        if (profileCheckError.code === 'PGRST116') {
          console.log('Profile does not exist, creating new profile');
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: formData.role,
              company_size: formData.companySize,
              goals: formData.goals,
              referral_source: formData.referralSource
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
        } else {
          throw profileCheckError;
        }
      } else {
        console.log('Profile exists, updating');
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
            company_size: formData.companySize,
            goals: formData.goals,
            referral_source: formData.referralSource
          })
          .eq("id", user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      }

      // If invited user, update password
      if (isInvitedUser && formData.password) {
        console.log('Updating password for invited user');
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        });

        if (passwordError) {
          console.error('Error updating password:', passwordError);
          throw passwordError;
        }
      }

      // Create workspace only if:
      // 1. The user has provided a workspace name AND
      // 2. The user is not an invited user (invited users join existing workspaces)
      if (formData.workspaceName && !isInvitedUser) {
        console.log('Creating workspace:', formData.workspaceName);
        const slug = `${generateSlug(formData.workspaceName)}-${Date.now()}`;
        
        try {
          // Use the RPC function to create workspace with owner role
          const { data: workspace, error: workspaceError } = await supabase
            .rpc('create_workspace_with_owner', {
              workspace_name: formData.workspaceName,
              workspace_slug: slug,
              owner_id: user.id
            });

          if (workspaceError) {
            console.error('Error creating workspace:', workspaceError);
            throw workspaceError;
          }

          console.log('Workspace created successfully:', workspace);

          // Invalidate queries to refresh workspace data
          await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
          
          // Set the newly created workspace as the selected one
          if (workspace) {
            const workspaceObj = typeof workspace === 'string' ? JSON.parse(workspace) : workspace;
            localStorage.setItem('selectedWorkspace', workspaceObj.id);
          }
        } catch (error) {
          console.error('Error in workspace creation:', error);
          throw error;
        }
      } else {
        console.log('No workspace creation needed:', 
          formData.workspaceName ? 'Has workspace name' : 'No workspace name',
          isInvitedUser ? 'Is invited user' : 'Not invited user');
      }

      toast({
        title: "Setup complete",
        description: "Your profile has been created successfully.",
      });

      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error in onboarding:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete setup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return { handleSubmit, loading };
}
