import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // First query to get the current session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Only query profile data if we have a session
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("No session");

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, role, company_size, goals, referral_source")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id, // Only run this query if we have a user ID
  });

  useEffect(() => {
    if (!profileLoading && profile) {
      // Show onboarding if any required field is missing
      const requiredFields = [
        'first_name',
        'last_name',
        'role',
        'company_size',
        'goals',
        'referral_source'
      ];
      
      const missingFields = requiredFields.some(field => !profile[field]);
      setShowOnboarding(missingFields);
    }
  }, [profile, profileLoading]);

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

  // If no session, the RequireAuth component will handle the redirect
  if (!session) {
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
      {showOnboarding && <OnboardingModal />}
    </div>
  );
}