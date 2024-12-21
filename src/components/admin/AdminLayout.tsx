import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pl-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}