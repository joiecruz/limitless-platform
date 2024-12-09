import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/courses")}
      >
        <div className="aspect-[16/10]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Website_Assets__1_.png"
            alt="Courses"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Explore online courses</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">
            Upgrade your knowledge and skills on innovation with our transformative online programs
          </p>
        </div>
      </Card>

      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/tools")}
      >
        <div className="aspect-[16/10]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Tools_QuickLinks.png"
            alt="Innovation Tools"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Access innovation templates</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">
            Download free resources and tools to help jumpstart your innovation projects
          </p>
        </div>
      </Card>

      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/community")}
      >
        <div className="aspect-[16/10]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Community_QuickLinks.png"
            alt="Community"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Engage with fellow innovators</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">
            Join the Limitless Lab community and find potential collaborators
          </p>
        </div>
      </Card>

      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/projects")}
      >
        <div className="aspect-[16/10]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Projects_QuickLinks.png"
            alt="Projects"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Create your innovation project</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500">
            Be guided step-by-step on creating and implementing your idea
          </p>
        </div>
      </Card>
    </div>
  );
}