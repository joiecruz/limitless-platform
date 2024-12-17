import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LayoutDashboard, Users, Briefcase, BookOpen } from "lucide-react";
import { UserProfile } from "@/components/layout/UserProfile";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        console.log("Checking superadmin status...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          throw userError;
        }

        if (!user) {
          console.log("No user found");
          throw new Error("No user found");
        }

        console.log("Current user:", user.email);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_superadmin')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error checking admin status:', profileError);
          throw profileError;
        }

        console.log("Profile data:", profile);

        if (!profile?.is_superadmin) {
          console.log("User is not a superadmin");
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this area.",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }

        console.log("Superadmin access granted");
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkSuperAdmin:', error);
        toast({
          title: "Access Error",
          description: "There was an error checking your permissions.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    };

    checkSuperAdmin();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r h-screen flex flex-col fixed">
          <div className="flex items-center px-6 py-4">
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
              alt="Limitless Lab"
              className="h-12 w-auto"
            />
          </div>
          <nav className="px-4 mt-6 flex-1 overflow-y-auto">
            <div className="space-y-1">
              <Link 
                to="/admin" 
                className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link 
                to="/admin/users" 
                className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
              >
                <Users className="h-5 w-5" />
                Users
              </Link>
              <Link 
                to="/admin/workspaces" 
                className={`nav-item ${isActive('/admin/workspaces') ? 'active' : ''}`}
              >
                <Briefcase className="h-5 w-5" />
                Workspaces
              </Link>
              <Link 
                to="/admin/courses" 
                className={`nav-item ${isActive('/admin/courses') ? 'active' : ''}`}
              >
                <BookOpen className="h-5 w-5" />
                Courses
              </Link>
            </div>
          </nav>
          <div className="mt-auto border-t">
            <Link to="/dashboard" className="nav-item">
              User Dashboard
            </Link>
          </div>
          <UserProfile />
        </aside>
        <main className="flex-1 pl-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}