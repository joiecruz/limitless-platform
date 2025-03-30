
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function AdminLayout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile header */}
      <div className="sticky top-0 z-10 md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
            alt="Limitless Lab"
            className="h-8 w-auto" 
          />
        </div>
      </div>

      <div className="flex">
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
              alt="Limitless Lab"
              className="h-10 w-auto"
            />
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <AdminSidebar />
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-64 md:flex-shrink-0">
          <div className="h-full">
            <AdminSidebar />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto w-full">
          <div className="p-4 md:p-8 pt-4 md:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
