import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { OnboardingData } from "../types";

export function useOnboardingSubmit({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (formData: OnboardingData) => {
    console.log('Starting onboarding submission with data:', formData);
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log('Updating profile for user:', user.id);

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

      // Create workspace with unique slug
      if (formData.workspaceName) {
        console.log('Creating workspace:', formData.workspaceName);
        const slug = `${generateSlug(formData.workspaceName)}-${Date.now()}`;
        
        // Use RPC to create workspace and add member in a single transaction
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

      toast({
        title: "Setup complete",
        description: "Your profile and workspace have been created successfully.",
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

  return { handleSubmit, loading };
}