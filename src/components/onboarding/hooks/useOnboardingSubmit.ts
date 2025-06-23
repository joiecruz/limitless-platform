import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingData } from "../types";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UseOnboardingSubmitProps {
  onOpenChange?: (open: boolean) => void;
  workspaceId?: string;
  onSuccess?: () => void;
}

export const useOnboardingSubmit = (props: UseOnboardingSubmitProps = {}) => {
  const { onOpenChange, workspaceId, onSuccess } = props;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const submitOnboarding = async (data: OnboardingData) => {
    setLoading(true);
    try {
      

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not found");
      }

      

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      

      // Update profile with onboarding data
      const profileUpdate = {
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        company_size: data.companySize,
        goals: Array.isArray(data.goals) ? data.goals.join(', ') : data.goals,
        referral_source: data.referralSource,
      };

      

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          ...profileUpdate
        });

      if (profileError) {
        
        throw profileError;
      }

      // Create workspace if provided
      if (data.workspaceName) {
        

        // Generate slug from name
        const slug = data.workspaceName.toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '') +
          '-' + Date.now();

        // Use the RPC function to create workspace with owner
        const { data: workspace, error: workspaceError } = await supabase
          .rpc('create_workspace_with_owner', {
            workspace_name: data.workspaceName.trim(),
            workspace_slug: slug,
            owner_id: user.id
          });

        if (workspaceError) {
          
          throw workspaceError;
        }

        
        
      } else {
        // For invited users (no workspace creation), ensure they're added to the workspace
        // Check if user has any pending invitations
        const { data: pendingInvitations, error: inviteError } = await supabase
          .from('workspace_invitations')
          .select('id, workspace_id, role, status')
          .eq('email', user.email)
          .eq('status', 'pending');

        if (inviteError) {
          
          // Don't throw error, just log it
        } else if (pendingInvitations && pendingInvitations.length > 0) {
          

          // Process each pending invitation
          for (const invitation of pendingInvitations) {
            // Check if user is already a member of this workspace
            const { data: existingMember, error: memberCheckError } = await supabase
              .from('workspace_members')
              .select('user_id')
              .eq('workspace_id', invitation.workspace_id)
              .eq('user_id', user.id)
              .maybeSingle();

            if (memberCheckError) {
              
              continue;
            }

            if (!existingMember) {
              // Add user to workspace
              const { error: addMemberError } = await supabase
                .from('workspace_members')
                .insert({
                  workspace_id: invitation.workspace_id,
                  user_id: user.id,
                  role: invitation.role
                });

              if (addMemberError) {
                
                continue;
              }

              
            }

            // Update invitation status to accepted
            const { error: updateInviteError } = await supabase
              .from('workspace_invitations')
              .update({
                status: 'accepted',
                accepted_at: new Date().toISOString()
              })
              .eq('id', invitation.id);

            if (updateInviteError) {
              
            } else {
              
            }
          }
        }
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
        
        // Don't throw here as it's not critical
      }

      

      // Invalidate workspaces queries to refresh the workspace list
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['user-workspaces'] });
      

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
