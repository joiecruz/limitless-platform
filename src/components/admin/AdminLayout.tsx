import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        console.log("Checking superadmin status...");
        
        // First get the current user
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

        // Then get their profile
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-6">
          <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Link 
              to="/admin/dashboard" 
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              Users
            </Link>
            <Link 
              to="/admin/workspaces" 
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              Workspaces
            </Link>
            <Link 
              to="/admin/courses" 
              className="block px-4 py-2 rounded hover:bg-gray-100"
            >
              Courses
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}