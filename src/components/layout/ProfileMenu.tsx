import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  PopoverContent,
} from "@/components/ui/popover";

export function ProfileMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate("/");
  };

  return (
    <PopoverContent className="w-56" align="start">
      <div className="space-y-1">
        <button
          onClick={() => navigate("/account-settings")}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Settings className="h-4 w-4" />
          Account Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </PopoverContent>
  );
}