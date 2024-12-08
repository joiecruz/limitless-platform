import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserAndProfile();
  }, []);

  const fetchUserAndProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
        return;
      }

      setUserEmail(user.email || '');

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();
    
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
    
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
    return userEmail?.[0]?.toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return userEmail;
  };

  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;
  };

  if (loading) {
    return (
      <div className="mt-auto px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex flex-col flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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
                {userEmail}
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