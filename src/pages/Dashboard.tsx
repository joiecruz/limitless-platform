import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isIncompleteProfile, setIsIncompleteProfile] = useState(location.state?.isIncompleteProfile || false);
  const [onboardingJustCompleted, setOnboardingJustCompleted] = useState(false);

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

  // Query to check if user has any workspace memberships
  const { data: workspaceMemberships, isLoading: workspacesLoading } = useQuery({
    queryKey: ["workspaceMemberships"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching workspace memberships:", error);
        return [];
      }

      return data || [];
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Dashboard - Current session:", session);

      if (error || !session) {
        console.log("Dashboard - No session found, redirecting to signin");
        navigate("/signin", { replace: true });
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  // Check for recent onboarding completion
  useEffect(() => {
    const checkOnboardingCompletion = () => {
      const completionFlag = localStorage.getItem('onboardingCompleted');
      if (completionFlag) {
        const completionTime = parseInt(completionFlag);
        const now = Date.now();

        // If onboarding was completed within the last 10 seconds, set flag
        if (now - completionTime < 10000) {
          console.log("Dashboard - Onboarding was recently completed, preventing retrigger");
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
      console.log("Dashboard - Queries still loading, waiting...");
      return;
    }

    // Don't show onboarding if it was just completed
    if (onboardingJustCompleted) {
      console.log("Dashboard - Onboarding just completed, skipping");
      setShowOnboarding(false);
      return;
    }

    console.log("Dashboard - Profile:", profile);
    console.log("Dashboard - Workspace memberships:", workspaceMemberships);

    // Check if profile is incomplete
    const profileIncomplete = !profile?.first_name ||
                          !profile?.last_name ||
                          !profile?.role ||
                          !profile?.company_size ||
                          !profile?.goals ||
                          !profile?.referral_source;

    // Check if user has no workspaces
    const noWorkspaces = !workspaceMemberships || workspaceMemberships.length === 0;

    // Determine if onboarding should be shown based on actual data only
    const needsOnboarding = profileIncomplete || noWorkspaces;

    console.log("Dashboard - Profile incomplete:", profileIncomplete);
    console.log("Dashboard - No workspaces:", noWorkspaces);
    console.log("Dashboard - Needs onboarding:", needsOnboarding);

    setShowOnboarding(needsOnboarding);
    setIsIncompleteProfile(profileIncomplete);

  }, [profile, profileLoading, workspaceMemberships, workspacesLoading, onboardingJustCompleted]);

  const quickLinks = [
    {
      title: "Explore online courses",
      description: "Upgrade your knowledge and skills on innovation with our transformative online programs",
      image: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Website_Assets__1_.png",
      action: "Start learning",
      link: "/dashboard/courses"
    },
    {
      title: "Access innovation templates",
      description: "Download free resources and tools to help jumpstart your innovation projects",
      image: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Tools_QuickLinks.png",
      action: "Browse tools",
      link: "/dashboard/tools"
    },
    {
      title: "Engage with fellow innovators",
      description: "Join the Limitless Lab community and find potential collaborators",
      image: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Community_QuickLinks.png",
      action: "Join community",
      link: "/dashboard/community"
    },
    {
      title: "Create your innovation project",
      description: "Be guided step-by-step on creating and implementing your idea",
      image: "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Projects_QuickLinks.png",
      action: "Create project",
      link: "/dashboard/projects"
    }
  ];

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return '';
  };

  const handleOnboardingClose = (open: boolean) => {
    setShowOnboarding(open);
    if (!open) {
      // Mark onboarding as completed when user closes it
      localStorage.setItem('onboardingCompleted', Date.now().toString());
      setOnboardingJustCompleted(true);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome{getDisplayName() ? `, ${getDisplayName()}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your innovation journey
          </p>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
            onClick={() => navigate(link.link)}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={link.image}
                alt={link.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg leading-tight">{link.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
              <div
                className="inline-flex items-center text-primary hover:gap-2 transition-all group/link"
              >
                {link.action}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        open={showOnboarding}
        onOpenChange={handleOnboardingClose}
        isIncompleteProfile={isIncompleteProfile}
      />
    </div>
  );
}
