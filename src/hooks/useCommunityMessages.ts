import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Channel, Message } from "@/types/community";
import { useQueryClient } from "@tanstack/react-query";

// Global cache for messages with TTL
interface CacheEntry {
  messages: Message[];
  timestamp: number;
  isValid: boolean;
}

const messageCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const globalUserCache = new Map<string, any>();

// Cache management functions
const getCacheKey = (channelId: string) => `messages:${channelId}`;

const isCacheValid = (entry: CacheEntry): boolean => {
  return entry.isValid && (Date.now() - entry.timestamp) < CACHE_TTL;
};

const setCacheEntry = (channelId: string, messages: Message[]) => {
  messageCache.set(getCacheKey(channelId), {
    messages: [...messages],
    timestamp: Date.now(),
    isValid: true
  });
};

const getCacheEntry = (channelId: string): Message[] | null => {
  const entry = messageCache.get(getCacheKey(channelId));
  if (entry && isCacheValid(entry)) {
    return [...entry.messages];
  }
  return null;
};

const invalidateCache = (channelId: string) => {
  const entry = messageCache.get(getCacheKey(channelId));
  if (entry) {
    entry.isValid = false;
  }
};

const updateCacheMessage = (channelId: string, updatedMessage: Message) => {
  const entry = messageCache.get(getCacheKey(channelId));
  if (entry && entry.isValid) {
    const messageIndex = entry.messages.findIndex(m => m.id === updatedMessage.id);
    if (messageIndex !== -1) {
      entry.messages[messageIndex] = updatedMessage;
    } else {
      entry.messages.push(updatedMessage);
      entry.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    entry.timestamp = Date.now();
  }
};

const removeCacheMessage = (channelId: string, messageId: string) => {
  const entry = messageCache.get(getCacheKey(channelId));
  if (entry && entry.isValid) {
    entry.messages = entry.messages.filter(m => m.id !== messageId);
    entry.timestamp = Date.now();
  }
};

interface ReactionPayload {
  new?: {
    message_id: string;
    emoji: string;
    user_id: string;
  };
  old?: {
    message_id: string;
    emoji: string;
    user_id: string;
  };
}

export function useCommunityMessages(activeChannel: Channel | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const activeSubscription = useRef<any>(null);
  const currentChannelRef = useRef<string | null>(null);

  // Get current user ID
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

  // Subscribe to message reactions changes
  useEffect(() => {
    if (!activeChannel?.id) return;

    // Note: Reaction updates are now handled by the main message subscription
    // to prevent duplicate message handling and key conflicts

    // Cleanup stale temporary messages every 10 seconds
    const cleanupInterval = setInterval(() => {
      setMessages(current => {
        const now = Date.now();
        const staleThreshold = 10000; // 10 seconds

        const cleanedMessages = current.filter(msg => {
          if (msg.id.startsWith('temp-')) {
            const messageAge = now - new Date(msg.created_at).getTime();
            if (messageAge > staleThreshold) {
              console.log(`Removing stale temporary message ${msg.id} (${messageAge}ms old)`);
              return false;
            }
          }
          return true;
        });

        return cleanedMessages.length !== current.length ? cleanedMessages : current;
      });
    }, 10000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [activeChannel?.id]);

  // Optimized message fetching with comprehensive caching
  const fetchMessages = async (channelId: string, useCache: boolean = true): Promise<Message[]> => {
    // Try cache first if enabled
    if (useCache) {
      const cachedMessages = getCacheEntry(channelId);
      if (cachedMessages) {
        console.log(`Cache hit for channel ${channelId}, ${cachedMessages.length} messages`);
        return cachedMessages;
      }
    }

    console.log(`Cache miss for channel ${channelId}, fetching from database`);
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          username,
          avatar_url,
          first_name,
          last_name
        ),
        message_reactions (
          id,
          emoji,
          user_id
        )
      `)
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    const fetchedMessages = data || [];

    // Double-check: Ensure all messages belong to the correct channel
    const validMessages = fetchedMessages.filter(msg => msg.channel_id === channelId);
    if (validMessages.length !== fetchedMessages.length) {
      console.warn(`Filtered out ${fetchedMessages.length - validMessages.length} messages that didn't belong to channel ${channelId}`);
    }

    // Cache the results
    setCacheEntry(channelId, validMessages);
    console.log(`Cached ${validMessages.length} messages for channel ${channelId}`);

    return validMessages;
  };

  // Helper function to fetch complete message data with caching
  const fetchCompleteMessage = async (messageId: string): Promise<Message | null> => {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles (
          username,
          avatar_url,
          first_name,
          last_name
        ),
        message_reactions (
          id,
          emoji,
          user_id
        )
      `)
      .eq("id", messageId)
      .single();

    if (error) {
      console.error("Error fetching complete message:", error);
      return null;
    }

    return data as Message;
  };

  useEffect(() => {
    // IMMEDIATE CHANNEL PROTECTION: Clear messages immediately when channel changes
    if (!activeChannel) {
      console.log("No active channel, clearing messages");
      setMessages([]);
      currentChannelRef.current = null;
      return;
    }

    // If channel changed, immediately clear messages to prevent cross-contamination
    if (currentChannelRef.current && currentChannelRef.current !== activeChannel.id) {
      console.log(`Channel changed from ${currentChannelRef.current} to ${activeChannel.id}, clearing messages`);
      setMessages([]);
    }

    currentChannelRef.current = activeChannel.id;

    const loadMessages = async () => {
      try {
        // Check cache first
        const cachedMessages = getCacheEntry(activeChannel.id);
        if (cachedMessages) {
          console.log(`Loading ${cachedMessages.length} cached messages instantly for channel ${activeChannel.id}`);

          // Additional safety check: Ensure cached messages belong to current channel
          const validCachedMessages = cachedMessages.filter(msg => msg.channel_id === activeChannel.id);
          if (validCachedMessages.length !== cachedMessages.length) {
            console.warn(`Filtered out ${cachedMessages.length - validCachedMessages.length} invalid cached messages for channel ${activeChannel.id}`);
            // Update cache with valid messages only
            setCacheEntry(activeChannel.id, validCachedMessages);
          }

          setMessages(validCachedMessages);
          setIsLoading(false);

          // Background refresh - fetch fresh data without showing loading
          fetchMessages(activeChannel.id, false).then(freshMessages => {
            console.log(`Background refresh completed for channel ${activeChannel.id}`);
            // Ensure we're still on the same channel before updating
            if (currentChannelRef.current === activeChannel.id) {
              setMessages(freshMessages);
              setCacheEntry(activeChannel.id, freshMessages);
            }
          }).catch(error => {
            console.error("Background refresh failed:", error);
          });
        } else {
          // No cache - show loading and fetch
          setIsLoading(true);
          const fetchedMessages = await fetchMessages(activeChannel.id, false);

          // Ensure we're still on the same channel before updating
          if (currentChannelRef.current === activeChannel.id) {
            setMessages(fetchedMessages);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    loadMessages();

    // Clean up previous subscription
    if (activeSubscription.current) {
      activeSubscription.current.unsubscribe();
    }

    // Consolidated subscription for all message events
    activeSubscription.current = supabase
      .channel(`messages:${activeChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        async (payload) => {
          // Additional safety check: Ensure the message belongs to the current channel
          const messageChannelId = (payload.new as any)?.channel_id || (payload.old as any)?.channel_id;
          if (messageChannelId && messageChannelId !== activeChannel.id) {
            console.warn(`Received message event for wrong channel ${messageChannelId}, current channel is ${activeChannel.id}`);
            return;
          }

          // Also check that we're still on the same channel
          if (currentChannelRef.current !== activeChannel.id) {
            console.warn(`Ignoring message event because channel changed`);
            return;
          }

          if (payload.eventType === 'INSERT') {
            const completeMessage = await fetchCompleteMessage(payload.new.id);
            if (completeMessage && completeMessage.channel_id === activeChannel.id) {
              setMessages(current => {
                // First, check if this exact message ID already exists (prevents all duplicates)
                if (current.some(msg => msg.id === completeMessage.id)) {
                  console.log(`Message ${completeMessage.id} already exists, skipping duplicate from subscription`);
                  return current;
                }

                // Check if this is a message from the current user that might replace an optimistic message
                if (completeMessage.user_id === currentUserId) {
                  // Look for a temporary message that could be replaced
                  const tempMessageIndex = current.findIndex(msg =>
                    msg.id.startsWith('temp-') &&
                    msg.user_id === currentUserId &&
                    Math.abs(new Date(msg.created_at).getTime() - new Date(completeMessage.created_at).getTime()) < 5000 // Within 5 seconds
                  );

                  if (tempMessageIndex !== -1) {
                    // Replace the temporary message with the real one
                    const updated = [...current];
                    updated[tempMessageIndex] = completeMessage;
                    console.log(`Replaced temporary message with real message ${completeMessage.id} from subscription`);
                    updateCacheMessage(activeChannel.id, completeMessage);
                    return updated;
                  }
                }

                // If no temporary message found, add the new message (could be from another user)
                const updated = [...current, completeMessage];
                console.log(`Added new message ${completeMessage.id} from subscription`);
                updateCacheMessage(activeChannel.id, completeMessage);
                return updated;
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const completeMessage = await fetchCompleteMessage(payload.new.id);
            if (completeMessage && completeMessage.channel_id === activeChannel.id) {
              setMessages(current => {
                const updated = current.map(msg =>
                  msg.id === completeMessage.id ? completeMessage : msg
                );
                updateCacheMessage(activeChannel.id, completeMessage);
                return updated;
              });
            }
          } else if (payload.eventType === 'DELETE') {
            setMessages(current => {
              const updated = current.filter(msg => msg.id !== payload.old.id);
              removeCacheMessage(activeChannel.id, payload.old.id);
              return updated;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        },
        async (payload) => {
          console.log('Reaction change received:', payload);

          const messageId = (payload.new as any)?.message_id || (payload.old as any)?.message_id;
          if (!messageId) return;

          // Only update if this reaction is for a message in the current channel
          setMessages(current => {
            const messageInChannel = current.find(msg => msg.id === messageId);
            if (!messageInChannel) return current; // Message not in current channel

            // Fetch updated reactions for this specific message
            supabase
              .from('message_reactions')
              .select('*')
              .eq('message_id', messageId)
              .then(({ data: updatedReactions, error }) => {
                if (error) {
                  console.error('Error fetching updated reactions:', error);
                  return;
                }

                setMessages(currentMessages =>
                  currentMessages.map(message => {
                    if (message.id === messageId) {
                      return {
                        ...message,
                        message_reactions: updatedReactions || []
                      };
                    }
                    return message;
                  })
                );
              });

            return current; // Return unchanged state, update will happen in the promise above
          });
        }
      )
      .subscribe();

    return () => {
      if (activeSubscription.current) {
        activeSubscription.current.unsubscribe();
        activeSubscription.current = null;
      }
    };
  }, [activeChannel?.id]);

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!activeChannel || (!content.trim() && !imageUrl) || !currentUserId) {
      return;
    }

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMessage: Message = {
      id: tempId,
      content,
      image_url: imageUrl,
      channel_id: activeChannel.id,
      user_id: currentUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parent_id: null,
      profiles: globalUserCache.get(`profile-${currentUserId}`) || {
        username: 'You',
        avatar_url: null,
        first_name: null,
        last_name: null,
      },
      message_reactions: [],
    };

    // Optimistic update - show message immediately
    setMessages(current => {
      const updated = [...current, optimisticMessage];
      console.log(`Optimistic update: Added temporary message ${tempId} to channel ${activeChannel.id}`);
      return updated;
    });

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            content,
            image_url: imageUrl,
            channel_id: activeChannel.id,
            user_id: currentUserId,
          },
        ])
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            first_name,
            last_name
          ),
          message_reactions (
            id,
            emoji,
            user_id
          )
        `)
        .single();

      if (error) throw error;

      // Replace optimistic message with real message
      if (data && data.channel_id === activeChannel.id) {
        setMessages(current => {
          // First check if the real message already exists (subscription beat us to it)
          if (current.some(msg => msg.id === data.id)) {
            console.log(`Real message ${data.id} already exists from subscription, removing temp message ${tempId}`);
            // Just remove the temp message since real one already exists
            const updated = current.filter(msg => msg.id !== tempId);
            return updated;
          }

          // Check if the temporary message still exists
          const hasTempMessage = current.some(msg => msg.id === tempId);
          if (hasTempMessage) {
            const updated = current.map(msg =>
              msg.id === tempId ? data : msg
            );
            updateCacheMessage(activeChannel.id, data);
            console.log(`Replaced temporary message ${tempId} with real message ${data.id} in sendMessage`);
            return updated;
          } else {
            // Temporary message doesn't exist (might have been replaced by subscription)
            // But real message also doesn't exist, so add it
            const updated = [...current, data];
            updateCacheMessage(activeChannel.id, data);
            console.log(`Added real message ${data.id} in sendMessage (temp message not found)`);
            return updated;
          }
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove optimistic message on error
      setMessages(current => {
        const updated = current.filter(msg => msg.id !== tempId);
        console.log(`Removed failed optimistic message ${tempId} from channel ${activeChannel.id}`);
        return updated;
      });

      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Force refresh function for manual cache invalidation
  const forceRefresh = async () => {
    if (!activeChannel) return;

    invalidateCache(activeChannel.id);
    setIsLoading(true);

    try {
      const freshMessages = await fetchMessages(activeChannel.id, false);
      // Ensure we're still on the same channel before updating
      if (currentChannelRef.current === activeChannel.id) {
        setMessages(freshMessages);
      }
    } catch (error) {
      console.error("Error during force refresh:", error);
      toast({
        title: "Error",
        description: "Failed to refresh messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    forceRefresh
  };
}