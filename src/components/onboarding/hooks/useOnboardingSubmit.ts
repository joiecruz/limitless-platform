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
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          company_size: formData.companySize,
          goals: JSON.stringify(formData.goals),
          referral_source: formData.referralSource
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Create workspace with unique slug
      const slug = generateSlug(formData.workspaceName);
      const { data: workspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert({
          name: formData.workspaceName,
          slug: `${slug}-${Date.now()}`
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Add user as workspace owner
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      // Invalidate queries to refresh workspace data
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });

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