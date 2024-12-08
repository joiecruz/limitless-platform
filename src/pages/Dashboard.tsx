import { Card } from "@/components/ui/card";
import { BookOpen, Users, FolderKanban, Download, ArrowRight, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Here's an overview of your innovation journey
          </p>
        </div>
        <Button className="hidden sm:flex items-center gap-2">
          View All Projects <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-primary-50 rounded-lg">
              <FolderKanban className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-2xl font-bold">12</span>
          </div>
          <h3 className="font-semibold">Active Projects</h3>
          <p className="text-sm text-muted-foreground">
            Track your innovation projects
          </p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold">5</span>
          </div>
          <h3 className="font-semibold">Courses</h3>
          <p className="text-sm text-muted-foreground">
            Access learning materials
          </p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Download className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold">24</span>
          </div>
          <h3 className="font-semibold">Tools</h3>
          <p className="text-sm text-muted-foreground">
            Download innovation resources
          </p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">156</span>
          </div>
          <h3 className="font-semibold">Community</h3>
          <p className="text-sm text-muted-foreground">
            Connect with innovators
          </p>
        </Card>
      </div>

      {/* Featured Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Courses</h2>
            <Button variant="ghost" className="text-sm" size="sm">
              View all
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={`https://images.unsplash.com/photo-148${i}312338219-ce68d2c6f44d`}
                  alt="Course thumbnail"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">Innovation Fundamentals {i + 1}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>2h 30m</span>
                    <Star className="h-4 w-4 ml-2" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Tools */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Popular Tools</h2>
            <Button variant="ghost" className="text-sm" size="sm">
              View all
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={`https://images.unsplash.com/photo-151${i}770660439-4636190af475`}
                  alt="Tool thumbnail"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">Innovation Toolkit {i + 1}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    Essential tools for your innovation process
                  </p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}