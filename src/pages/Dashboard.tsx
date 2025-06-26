
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickLinksGrid } from "@/components/dashboard/QuickLinksGrid";
import { useDashboardAuth } from "@/hooks/useDashboardAuth";
import { useDashboardQueries } from "@/hooks/useDashboardQueries";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";
import { getDisplayName } from "@/utils/dashboardHelpers";

export default function Dashboard() {
  useDashboardAuth();
  
  const {
    profile,
    profileLoading,
    userWorkspaces,
    workspacesLoading
  } = useDashboardQueries();

  const {
    showOnboarding,
    isIncompleteProfile,
    handleOnboardingClose
  } = useOnboardingLogic({
    profile,
    profileLoading,
    userWorkspaces,
    workspacesLoading
  });

  const displayName = getDisplayName(profile);

  return (
    <div className="space-y-8 animate-fade-in pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <DashboardHeader displayName={displayName} />
      <QuickLinksGrid />
      <OnboardingModal 
        open={showOnboarding} 
        onOpenChange={handleOnboardingClose} 
        isIncompleteProfile={isIncompleteProfile} 
      />
    </div>
  );
}
