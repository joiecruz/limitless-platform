
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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

export function QuickLinksGrid() {
  const navigate = useNavigate();

  return (
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
            <div className="inline-flex items-center text-primary hover:gap-2 transition-all group/link">
              {link.action}
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
