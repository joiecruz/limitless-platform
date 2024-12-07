import { Home, BookOpen, Users, Settings, Download, Briefcase, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Tools", href: "/tools", icon: Download },
  { name: "Community", href: "/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user?.id)
      .single();
    
    if (!error && data) {
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

  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;
  };
  
  return (
    <div className="flex flex-col h-full">
      <nav className="space-y-1 px-3 mb-6">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`nav-item ${location.pathname === item.href ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.href);
            }}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      
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
                  {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user?.email}
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
                onClick={() => navigate("/dashboard/settings")}
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
    </div>
  );
}