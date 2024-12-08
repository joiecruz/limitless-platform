import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  // Query to get user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const quickLinks = [
    {
      title: "Explore online courses",
      description: "Upgrade your knowledge and skills on innovation with our transformative online programs",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      action: "Start learning",
      link: "/courses"
    },
    {
      title: "Access innovation templates",
      description: "Download free resources and tools to help jumpstart your innovation projects",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      action: "Browse tools",
      link: "/tools"
    },
    {
      title: "Engage with fellow innovators",
      description: "Join the Limitless Lab community and find potential collaborators",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      action: "Join community",
      link: "/community"
    },
    {
      title: "Create your innovation project",
      description: "Be guided step-by-step on creating and implementing your idea",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      action: "Create project",
      link: "/projects"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your innovation journey
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-lg transition-all duration-200 group"
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
              <a
                href={link.link}
                className="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {link.action}
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Courses</h2>
            <a
              href="/courses"
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
              View all
            </a>
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
                  <p className="text-sm text-muted-foreground truncate">
                    Essential concepts for innovation success
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Tools */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Popular Tools</h2>
            <a
              href="/tools"
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
              View all
            </a>
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
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}