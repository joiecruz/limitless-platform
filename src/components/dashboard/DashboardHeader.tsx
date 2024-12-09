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
        <div className="aspect-[2/1]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Website_Assets__1_.png"
            alt="Courses"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Courses</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Access your learning materials
          </p>
        </div>
      </Card>

      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/tools")}
      >
        <div className="aspect-[2/1]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Tools_QuickLinks.png"
            alt="Innovation Tools"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Innovation Tools</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Explore innovation resources
          </p>
        </div>
      </Card>

      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/community")}
      >
        <div className="aspect-[2/1]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Community_QuickLinks.png"
            alt="Community"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Community</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Connect with other innovators
          </p>
        </div>
      </Card>

      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => navigate("/projects")}
      >
        <div className="aspect-[2/1]">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Projects_QuickLinks.png"
            alt="Projects"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Projects</h3>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage your innovation projects
          </p>
        </div>
      </Card>
    </div>
  );
}