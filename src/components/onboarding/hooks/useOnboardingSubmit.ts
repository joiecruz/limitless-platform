import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { OnboardingData } from "../types";
import { useSearchParams } from "react-router-dom";

export function useOnboardingSubmit({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const isInvitedUser = Boolean(searchParams.get("workspace"));

  const handleSubmit = async (formData: OnboardingData) => {
    console.log('Starting onboarding submission with data:', formData);
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log('Updating profile for user:', user.id);

      // If invited user, update password
      if (isInvitedUser && formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        });

        if (passwordError) {
          console.error('Error updating password:', passwordError);
          throw passwordError;
        }
      }

      // Update profile
      const { error: profileError } = await supabase
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

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      console.log('Profile updated successfully');

      // Create workspace only if not an invited user
      if (!isInvitedUser && formData.workspaceName) {
        console.log('Creating workspace:', formData.workspaceName);
        const slug = `${generateSlug(formData.workspaceName)}-${Date.now()}`;
        
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
      }

      // If invited user, add them to the workspace
      if (isInvitedUser) {
        const workspaceId = searchParams.get("workspace");
        const role = searchParams.get("role");
        
        if (workspaceId && role) {
          const { error: memberError } = await supabase
            .from("workspace_members")
            .insert({
              workspace_id: workspaceId,
              user_id: user.id,
              role: role
            });

          if (memberError && memberError.code !== '23505') { // Ignore if already a member
            console.error('Error adding to workspace:', memberError);
            throw memberError;
          }
        }
      }

      toast({
        title: "Setup complete",
        description: "Your profile has been created successfully.",
      });

      if (onOpenChange) onOpenChange(false);
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