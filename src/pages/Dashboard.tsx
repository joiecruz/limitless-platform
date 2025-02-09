
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
      
      setShowOnboarding(needsOnboarding || location.state?.showOnboarding);
    }
  }, [profile, profileLoading, location.state]);

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
    <div className="space-y-4 animate-fade-in max-w-[1400px] mx-auto px-4">
      {/* Header Section - Reduced vertical spacing */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome{getDisplayName() ? `, ${getDisplayName()}` : ''}!
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's an overview of your innovation journey
          </p>
        </div>
      </div>

      {/* Quick Links Grid - Optimized for smaller screens */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
            onClick={() => navigate(link.link)}
          >
            <div className="aspect-[16/9] relative overflow-hidden">
              <img
                src={link.image}
                alt={link.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-base leading-tight">{link.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              </div>
              <div className="inline-flex items-center text-primary text-sm hover:gap-1 transition-all group/link">
                {link.action}
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0" />
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
