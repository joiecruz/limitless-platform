import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "@/types/community";

interface TypingUser {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export function useTypingIndicator(activeChannel: Channel | null) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const presenceRef = useRef<any>(null);

  useEffect(() => {
    if (!activeChannel) {
      console.log("No active channel, clearing typing users");
      setTypingUsers([]);
      return;
    }

    const channelName = `typing:${activeChannel.id}`;
    console.log("[TypingIndicator] Setting up for channel:", channelName);

    // Clean up previous presence channel if it exists
    if (presenceRef.current) {
      console.log("[TypingIndicator] Cleaning up previous presence channel");
      presenceRef.current.unsubscribe();
    }

    // Create new presence channel with proper configuration
    const presence = supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: '' }
      }
    });
    presenceRef.current = presence;

    presence
      .on('presence', { event: 'sync' }, async () => {
        const presenceState = presence.presenceState();
        console.log('[TypingIndicator] Presence state changed:', presenceState);

        // Get all unique user IDs from presence state
        const userIds = new Set<string>();
        Object.values(presenceState).forEach((users: any) => {
          users.forEach((user: any) => {
            console.log('[TypingIndicator] Checking user:', user);
            if (user.user_id && user.is_typing) {
              console.log('[TypingIndicator] Adding typing user:', user.user_id);
              userIds.add(user.user_id);
            }
          });
        });

        console.log('[TypingIndicator] Found typing users:', Array.from(userIds));

        // Fetch user profiles for typing users
        if (userIds.size === 0) {
          console.log('[TypingIndicator] No typing users, clearing state');
          setTypingUsers([]);
          return;
        }

        console.log('[TypingIndicator] Fetching profiles for users:', Array.from(userIds));
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, first_name, last_name, avatar_url')
          .in('id', Array.from(userIds));

        if (error) {
          console.error('[TypingIndicator] Error fetching typing users:', error);
          return;
        }

        console.log('[TypingIndicator] Fetched profiles:', data);
        setTypingUsers(data || []);
      })
      .subscribe(async (status) => {
        console.log('[TypingIndicator] Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log('[TypingIndicator] Initializing presence for user:', user.id);
            await presence.track({
              user_id: user.id,
              is_typing: false,
            });
          }
        }
      });

    return () => {
      console.log('[TypingIndicator] Cleaning up presence channel');
      if (presenceRef.current) {
        presenceRef.current.unsubscribe();
      }
    };
  }, [activeChannel?.id]);

  const setTyping = async (typing: boolean) => {
    if (!activeChannel || !presenceRef.current) {
      console.log('[TypingIndicator] Cannot set typing - no channel or presence:', {
        hasChannel: !!activeChannel,
        hasPresence: !!presenceRef.current
      });
      return;
    }

    console.log('[TypingIndicator] Setting typing status:', typing);
    setIsTyping(typing);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[TypingIndicator] No authenticated user found');
        return;
      }

      console.log('[TypingIndicator] Updating presence for user:', user.id);
      await presenceRef.current.track({
        user_id: user.id,
        is_typing: typing,
      });

      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        console.log('[TypingIndicator] Clearing existing timeout');
        clearTimeout(typingTimeoutRef.current);
      }

      // If typing, set a timeout to automatically set is_typing to false after 3 seconds
      if (typing) {
        console.log('[TypingIndicator] Setting auto-clear timeout');
        typingTimeoutRef.current = setTimeout(async () => {
          console.log('[TypingIndicator] Auto-clearing typing status');
          setIsTyping(false);
          await presenceRef.current.track({
            user_id: user.id,
            is_typing: false,
          });
        }, 3000);
      }
    } catch (error) {
      console.error('[TypingIndicator] Error updating typing status:', error);
    }
  };

  return {
    typingUsers,
    setTyping,
    isTyping,
  };
}