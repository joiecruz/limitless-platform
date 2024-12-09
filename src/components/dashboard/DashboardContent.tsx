import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { useEffect, useState } from "react";

export function DashboardContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Query to get user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, role, company_size, goals, referral_source")
        .eq("id", user.id)
        .single();

      return data;
    },
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

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <DashboardHeader />
      {showOnboarding && <OnboardingModal />}
    </div>
  );
}