import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/community";

interface UnreadCount {
  [key: string]: number;
}

export function useChannelNotifications(activeChannel: Channel | null) {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount>({});
  const [lastVisited, setLastVisited] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load last visited timestamps from localStorage
    const storedLastVisited = localStorage.getItem('channelLastVisited');
    if (storedLastVisited) {
      setLastVisited(JSON.parse(storedLastVisited));
    }

    // Subscribe to new messages
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const channelId = payload.new.channel_id;
          const { data: { user } } = await supabase.auth.getUser();

          // Don't increment if:
          // 1. We're in the active channel
          // 2. The message is from the current user
          if (channelId === activeChannel?.id || payload.new.user_id === user?.id) {
            return;
          }

          setUnreadCounts(prev => ({
            ...prev,
            [channelId]: (prev[channelId] || 0) + 1
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChannel?.id]); // Add activeChannel.id as dependency

  useEffect(() => {
    // Update last visited time when changing channels
    if (activeChannel) {
      const now = new Date().toISOString();
      setLastVisited(prev => ({
        ...prev,
        [activeChannel.id]: now
      }));
      localStorage.setItem('channelLastVisited', JSON.stringify({
        ...lastVisited,
        [activeChannel.id]: now
      }));
      // Reset unread count for this channel
      setUnreadCounts(prev => ({
        ...prev,
        [activeChannel.id]: 0
      }));
    }
  }, [activeChannel]);

  return { unreadCounts };
}