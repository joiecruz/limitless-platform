import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function RequireAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin, is_superadmin')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setIsAdmin(profile?.is_admin || profile?.is_superadmin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Could not verify admin status",
          variant: "destructive",
        });
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [toast]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}