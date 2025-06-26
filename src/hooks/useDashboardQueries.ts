
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardQueries() {
  // Query to get user profile data
  const {
    data: profile,
    isLoading: profileLoading
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data
      } = await supabase.from("profiles").select("first_name, last_name, role, company_size, goals, referral_source").eq("id", user.id).single();
      return data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Query to get user workspaces using the proper function
  const {
    data: userWorkspaces,
    isLoading: workspacesLoading
  } = useQuery({
    queryKey: ["user-workspaces"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return [];
      const {
        data,
        error
      } = await supabase.functions.invoke('get-user-workspaces', {
        body: {
          user_id: user.id
        }
      });
      if (error) {
        return [];
      }
      return data?.workspaces || [];
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return {
    profile,
    profileLoading,
    userWorkspaces,
    workspacesLoading
  };
}
