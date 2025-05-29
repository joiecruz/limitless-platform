import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/community";

interface OnlineUser {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export function useOnlineUsers(activeChannel: Channel | null) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!activeChannel) {
      setOnlineUsers([]);
      return;
    }

    const channelName = `presence:${activeChannel.id}`;
    console.log("Setting up presence for channel:", channelName);

    const presence = supabase.channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presence.presenceState();
        console.log('Presence state:', presenceState);

        // Get all unique user IDs from presence state
        const userIds = new Set<string>();
        Object.values(presenceState).forEach((users: any) => {
          users.forEach((user: any) => {
            if (user.user_id) {
              userIds.add(user.user_id);
            }
          });
        });

        // Fetch user profiles for online users
        const fetchUserProfiles = async () => {
          if (userIds.size === 0) {
            setOnlineUsers([]);
            return;
          }

          const { data, error } = await supabase
            .from('profiles')
            .select('id, username, first_name, last_name, avatar_url')
            .in('id', Array.from(userIds));

          if (error) {
            console.error('Error fetching online users:', error);
            return;
          }

          setOnlineUsers(data || []);
        };

        fetchUserProfiles();
      })
      .subscribe(async (status) => {
        console.log('Presence subscription status:', status);
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await presence.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      presence.unsubscribe();
    };
  }, [activeChannel?.id]);

  return onlineUsers;
}