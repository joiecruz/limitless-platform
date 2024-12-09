import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate("/courses")}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Courses</h3>
          <ArrowRight className="h-4 w-4 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Access your learning materials
        </p>
      </Card>

      <Card 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate("/tools")}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Innovation Tools</h3>
          <ArrowRight className="h-4 w-4 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Explore innovation resources
        </p>
      </Card>

      <Card 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate("/community")}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Community</h3>
          <ArrowRight className="h-4 w-4 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Connect with other innovators
        </p>
      </Card>

      <Card 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate("/projects")}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Projects</h3>
          <ArrowRight className="h-4 w-4 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage your innovation projects
        </p>
      </Card>
    </div>
  );
}