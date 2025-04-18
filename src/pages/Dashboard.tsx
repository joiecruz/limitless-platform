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
  const isIncompleteProfile = location.state?.isIncompleteProfile;

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

  // Check if onboarding is needed
  useEffect(() => {
    if (!profileLoading && profile) {
      const needsOnboarding = !profile.first_name || 
                            !profile.last_name || 
                            !profile.role || 
                            !profile.company_size || 
                            !profile.goals || 
                            !profile.referral_source;
      
      // Show onboarding if needed or if coming from email confirmation
      const shouldShowOnboarding = needsOnboarding || location.state?.showOnboarding;
      setShowOnboarding(shouldShowOnboarding);
      
      // If profile is incomplete and needs onboarding, set isIncompleteProfile in state
      if (needsOnboarding && !isIncompleteProfile) {
        navigate(location.pathname, { 
          state: { ...location.state, isIncompleteProfile: true },
          replace: true 
        });
      }
    }
  }, [profile, profileLoading, location.state, navigate, location.pathname, isIncompleteProfile]);

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
        onOpenChange={setShowOnboarding}
        isIncompleteProfile={isIncompleteProfile}
      />
    </div>
  );
}
