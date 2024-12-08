import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProfileDisplay } from "./ProfileDisplay";
import { ProfileMenu } from "./ProfileMenu";

export function UserProfile() {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();
    
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    
      return data;
    }
  });

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${(profile.first_name?.[0] || '').toUpperCase()}${(profile.last_name?.[0] || '').toUpperCase()}`;
    }
    return session?.email?.[0]?.toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return session?.email || '';
  };

  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`;
  };

  if (isLoading) {
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
          <button className="w-full">
            <ProfileDisplay
              avatarUrl={profile?.avatar_url || getDefaultAvatar()}
              initials={getInitials()}
              displayName={getDisplayName()}
              email={session?.email || ''}
            />
          </button>
        </PopoverTrigger>
        <ProfileMenu />
      </Popover>
    </div>
  );
}