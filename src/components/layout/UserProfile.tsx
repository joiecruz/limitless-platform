import { ProfileDisplay } from "./ProfileDisplay";
import { ProfileMenu } from "./ProfileMenu";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile, useUserSession, getInitials, getDisplayName, getDefaultAvatar } from "@/hooks/useUserProfile";

export function UserProfile() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    data: session,
    isLoading: sessionLoading,
    refetch: refetchSession
  } = useUserSession();

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
    error: profileError
  } = useUserProfile(session?.id);

  // Handle profile loading success
  useEffect(() => {
    if (!profileLoading && profile && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [profile, profileLoading, isInitialLoad]);

  // Reset initial load flag when user changes
  useEffect(() => {
    if (session?.id) {
      refetchProfile();
    }
  }, [session?.id, refetchProfile]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refetchSession();
      }

      if (_session?.user) {
        refetchProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetchProfile, refetchSession]);

  const initials = getInitials(profile?.first_name, profile?.last_name, session?.email);
  const displayName = getDisplayName(profile?.first_name, profile?.last_name, session?.email);
  const avatarUrl = profile?.avatar_url || getDefaultAvatar(initials);

  const isLoading = sessionLoading || (profileLoading && isInitialLoad);

  if (isLoading) {
    return (
      <div className="px-3 py-4 border-t border-gray-200">
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

  if (profileError) {
    
  }

  return (
    <div className="px-3 py-4 border-t border-gray-200">
      <div className="flex justify-center">
        <ProfileMenu>
          <ProfileDisplay
            avatarUrl={avatarUrl}
            initials={initials}
            displayName={displayName}
            email={session?.email || ''}
          />
        </ProfileMenu>
      </div>
    </div>
  );
}
