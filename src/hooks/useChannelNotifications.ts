import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/community";

// Global user cache to avoid repeated auth calls
const globalUserCache = new Map<string, any>();

interface UnreadCount {
  [key: string]: number;
}

export function useChannelNotifications(activeChannel: Channel | null) {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Cache user ID on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!globalUserCache.has('currentUser')) {
        const { data: { user } } = await supabase.auth.getUser();
        globalUserCache.set('currentUser', user?.id || null);
      }
      setCurrentUserId(globalUserCache.get('currentUser'));
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    // Subscribe to new messages
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const channelId = payload.new.channel_id;

          // Don't increment if:
          // 1. We're in the active channel
          // 2. The message is from the current user
          if (channelId === activeChannel?.id || payload.new.user_id === currentUserId) {
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
  }, [activeChannel?.id, currentUserId]);

  useEffect(() => {
    // Reset unread count when changing channels
    if (activeChannel) {
      setUnreadCounts(prev => ({
        ...prev,
        [activeChannel.id]: 0
      }));
    }
  }, [activeChannel?.id]);

  return { unreadCounts };
}