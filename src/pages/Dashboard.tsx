import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseAccessGrantedDialog } from "@/components/dashboard/CourseAccessGrantedDialog";
import { LimitlessBizAvailableDialog } from "@/components/dashboard/LimitlessBizAvailableDialog";
import { thumbUrl } from "@/lib/imageUrl";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Query to get user profile data
  const { data: profile, isLoading: isProfileLoading } = useQuery({
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        navigate("/signin", { replace: true });
        return;
      }
      setIsAuthChecking(false);
    };

    checkAuth();
  }, [navigate]);

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

  if (isAuthChecking || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pt-20 pb-10 px-4 sm:px-6 lg:px-8">
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
            <div className="aspect-video relative overflow-hidden bg-muted/30">
              <img
                src={thumbUrl(link.image, { width: 600 })}
                alt={link.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                width={600}
                height={450}
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

      {/* Course Access Granted Dialog */}
      <CourseAccessGrantedDialog />
      
      {/* LimitlessBiz Course Available Dialog */}
      <LimitlessBizAvailableDialog />
    </div>
  );
}
