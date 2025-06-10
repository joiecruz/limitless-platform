import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/community";

// Global user cache to avoid repeated auth calls
const globalUserCache = new Map<string, any>();

interface TypingUser {
  user_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export function useTypingIndicator(activeChannel: Channel | null) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const presenceRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

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
    if (!activeChannel || !currentUserId) {
      setTypingUsers([]);
      return;
    }

    const channelName = `typing:${activeChannel.id}`;

    presenceRef.current = supabase.channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceRef.current?.presenceState();
        if (!presenceState) return;

        const typingUsersList: TypingUser[] = [];
        Object.values(presenceState).forEach((users: any) => {
          users.forEach((user: any) => {
            if (user.is_typing && user.user_id !== currentUserId) {
              typingUsersList.push({
                user_id: user.user_id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
              });
            }
          });
        });

        setTypingUsers(typingUsersList);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceRef.current?.track({
            user_id: currentUserId,
            is_typing: false,
          });
        }
      });

    return () => {
      if (presenceRef.current) {
        presenceRef.current.unsubscribe();
      }
    };
  }, [activeChannel?.id, currentUserId]);

  const setTyping = async (typing: boolean) => {
    if (!activeChannel || !presenceRef.current || !currentUserId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      await presenceRef.current.track({
        user_id: currentUserId,
        is_typing: typing,
      });

      // Auto-clear typing after 3 seconds
      if (typing) {
        typingTimeoutRef.current = setTimeout(async () => {
          await presenceRef.current?.track({
            user_id: currentUserId,
            is_typing: false,
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  return {
    typingUsers,
    setTyping,
  };
}