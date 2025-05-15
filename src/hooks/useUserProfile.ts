
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_superadmin?: boolean | null;
}

export function useUserSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');
        return user;
      }
      return data.session.user;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 1
  });
}

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, is_superadmin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true
  });
}

export function getInitials(firstName?: string | null, lastName?: string | null, email?: string | null): string {
  if (firstName || lastName) {
    return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;
  }
  return email?.[0]?.toUpperCase() || '?';
}

export function getDisplayName(firstName?: string | null, lastName?: string | null, email?: string | null): string {
  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim();
  }
  return email || '';
}

export function getDefaultAvatar(initials: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`;
}
