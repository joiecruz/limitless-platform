import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { ProfileDisplay } from "./ProfileDisplay";

export function ProfileMenu() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      return profile;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${(profile.first_name?.[0] || '').toUpperCase()}${(profile.last_name?.[0] || '').toUpperCase()}`;
    }
    return '?';
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return 'User';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <ProfileDisplay 
          avatarUrl={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`}
          initials={getInitials()}
          displayName={getDisplayName()}
          email={profile?.email || 'No email provided'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile?.is_superadmin && (
          <>
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => navigate('/account-settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}