import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UserProfile() {
  const navigate = useNavigate();
  const user = useUser();
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    console.log('Fetching profile for user:', user?.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user?.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    if (data) {
      console.log('Profile data:', data);
      setProfile(data);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${(profile.first_name?.[0] || '').toUpperCase()}${(profile.last_name?.[0] || '').toUpperCase()}`;
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return user?.email;
  };

  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;
  };

  return (
    <div className="mt-auto px-3 py-4 border-t border-gray-200">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-3 px-2 w-full hover:bg-gray-100 rounded-lg transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || getDefaultAvatar()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-sm font-medium text-gray-700 truncate">
                {getDisplayName()}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.email}
              </span>
            </div>
          </button>
        </PopoverTrigger>
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
      </Popover>
    </div>
  );
}