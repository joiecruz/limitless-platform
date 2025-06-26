
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface OnboardingLogicProps {
  profile: any;
  profileLoading: boolean;
  userWorkspaces: any[];
  workspacesLoading: boolean;
}

export function useOnboardingLogic({
  profile,
  profileLoading,
  userWorkspaces,
  workspacesLoading
}: OnboardingLogicProps) {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isIncompleteProfile, setIsIncompleteProfile] = useState(location.state?.isIncompleteProfile || false);
  const [onboardingJustCompleted, setOnboardingJustCompleted] = useState(false);

  // Check for recent onboarding completion
  useEffect(() => {
    const checkOnboardingCompletion = () => {
      const completionFlag = localStorage.getItem('onboardingCompleted');
      if (completionFlag) {
        const completionTime = parseInt(completionFlag);
        const now = Date.now();

        // If onboarding was completed within the last 10 seconds, set flag
        if (now - completionTime < 10000) {
          setOnboardingJustCompleted(true);

          // Clear the flag after 10 seconds
          setTimeout(() => {
            setOnboardingJustCompleted(false);
            localStorage.removeItem('onboardingCompleted');
          }, 10000);
        } else {
          // Clear old completion flag
          localStorage.removeItem('onboardingCompleted');
        }
      }
    };
    checkOnboardingCompletion();
  }, []);

  // Check if onboarding is needed
  useEffect(() => {
    // Don't proceed if queries are still loading
    if (profileLoading || workspacesLoading) {
      return;
    }

    // Don't show onboarding if it was just completed
    if (onboardingJustCompleted) {
      setShowOnboarding(false);
      return;
    }

    // Check if user has already been marked as onboarded (navigated around dashboard)
    const hasNavigatedDashboard = localStorage.getItem('dashboard-visited');
    if (hasNavigatedDashboard) {
      setShowOnboarding(false);
      return;
    }

    // Check user profile completeness and workspace existence
    const hasName = profile?.first_name && profile?.last_name;
    const hasWorkspaces = userWorkspaces && userWorkspaces.length > 0;

    // If user has workspaces, they don't need onboarding
    if (hasWorkspaces) {
      localStorage.setItem('dashboard-visited', 'true');
      setShowOnboarding(false);
      return;
    }

    // Only show onboarding if user truly needs it:
    // 1. No name AND no workspaces - full onboarding
    // 2. Has name but no workspaces AND not marked as having visited dashboard - workspace creation only
    const needsFullOnboarding = !hasName && !hasWorkspaces;
    const needsWorkspaceCreation = hasName && !hasWorkspaces && !hasNavigatedDashboard;

    const shouldShowOnboarding = needsFullOnboarding || needsWorkspaceCreation;
    setShowOnboarding(shouldShowOnboarding);
    setIsIncompleteProfile(!hasName);
  }, [profile, profileLoading, userWorkspaces, workspacesLoading, onboardingJustCompleted]);

  const handleOnboardingClose = (open: boolean) => {
    setShowOnboarding(open);
    if (!open) {
      // Mark onboarding as completed when user closes it
      localStorage.setItem('onboardingCompleted', Date.now().toString());
      localStorage.setItem('dashboard-visited', 'true');
      setOnboardingJustCompleted(true);
    }
  };

  return {
    showOnboarding,
    isIncompleteProfile,
    handleOnboardingClose
  };
}
