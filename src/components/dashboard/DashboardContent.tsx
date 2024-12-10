import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardContent() {
  // First query to get the current session
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("Fetching session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        throw error;
      }
      console.log("Session data:", session);
      return session;
    },
  });

  // Only query profile data if we have a session
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.error("No session user ID available");
        throw new Error("No session");
      }

      console.log("Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data;
    },
    enabled: !!session?.user?.id, // Only run this query if we have a user ID
  });

  // Show loading state while checking session and profile
  if (sessionLoading || (session && profileLoading)) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <DashboardHeader />
      </div>
    );
  }

  // If there are any errors, show them
  if (sessionError) {
    console.error("Session error in render:", sessionError);
    return <div>Error loading session. Please try refreshing the page.</div>;
  }

  if (profileError) {
    console.error("Profile error in render:", profileError);
    return <div>Error loading profile. Please try refreshing the page.</div>;
  }

  // If no session, the RequireAuth component will handle the redirect
  if (!session) {
    console.log("No session found, returning null");
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {profile?.first_name} {profile?.last_name}!
        </h1>
        <p className="text-gray-500">
          What would you like to explore today?
        </p>
      </div>
      <DashboardHeader />
    </div>
  );
}