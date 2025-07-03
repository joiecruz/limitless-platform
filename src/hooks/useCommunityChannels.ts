import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Channel } from "@/types/community";

export function useCommunityChannels(workspaceId: string | null) {
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(() => {
    // Initialize from localStorage if available and we're in community
    try {
      const savedChannel = localStorage.getItem('limitless-active-channel');
      const savedWorkspaceId = localStorage.getItem('limitless-active-channel-workspace');

      // Only restore if the workspace matches
      if (savedChannel && savedWorkspaceId === workspaceId) {
        return JSON.parse(savedChannel);
      }
    } catch {
      // Ignore errors
    }
    return null;
  });
  const { toast } = useToast();

  // Custom setActiveChannel that persists to localStorage
  const setActiveChannelWithPersistence = useCallback((channel: Channel | null) => {
    setActiveChannel(channel);

    if (channel && workspaceId) {
      localStorage.setItem('limitless-active-channel', JSON.stringify(channel));
      localStorage.setItem('limitless-active-channel-workspace', workspaceId);
      
    } else {
      localStorage.removeItem('limitless-active-channel');
      localStorage.removeItem('limitless-active-channel-workspace');
      
    }
  }, [workspaceId]);

  const fetchPublicChannels = useCallback(async () => {
    
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("is_public", true)
      .order("name");

    if (error) {
      
      toast({
        title: "Error",
        description: "Failed to load public channels",
        variant: "destructive",
      });
      return null;
    }

    
    return data;
  }, [toast]);

  const fetchPrivateChannels = useCallback(async () => {
    if (!workspaceId) {
      
      setPrivateChannels([]); // Clear private channels when no workspace is selected
      return [];
    }

    
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("is_public", false)
      .order("name");

    if (error) {
      
      toast({
        title: "Error",
        description: "Failed to load private channels",
        variant: "destructive",
      });
      return [];
    }

    
    return data;
  }, [workspaceId, toast]);

  // Initial fetch of channels
  useEffect(() => {
    const initializeChannels = async () => {
      // Fetch public channels
      const publicData = await fetchPublicChannels();
      if (publicData) {
        setPublicChannels(publicData);
      }

      // Fetch private channels only if workspace is selected
      let privateData: Channel[] = [];
      if (workspaceId) {
        privateData = await fetchPrivateChannels() || [];
        setPrivateChannels(privateData);
      } else {
        setPrivateChannels([]);
      }

      // Check if we have a persisted active channel that still exists
      const allChannels = [...(publicData || []), ...privateData];
      const persistedChannel = activeChannel;

      if (persistedChannel && allChannels.some(ch => ch.id === persistedChannel.id)) {
        // Persisted channel still exists, keep it
        
        return;
      }

      // No valid persisted channel, set to first available channel
      if (workspaceId) {
        // Set active channel to first available channel in the workspace
        // Prioritize public channels, then private channels
        if (publicData && publicData.length > 0) {
          
          setActiveChannelWithPersistence(publicData[0]);
        } else if (privateData && privateData.length > 0) {
          
          setActiveChannelWithPersistence(privateData[0]);
        } else {
          
          setActiveChannelWithPersistence(null);
        }
      } else {
        // If no workspace, clear private channels and set to first public channel
        if (publicData && publicData.length > 0) {
          
          setActiveChannelWithPersistence(publicData[0]);
        } else {
          
          setActiveChannelWithPersistence(null);
        }
      }
    };

    initializeChannels();
  }, [workspaceId, fetchPublicChannels, fetchPrivateChannels, setActiveChannelWithPersistence]); // Added setActiveChannelWithPersistence to deps

  // Subscribe to channel changes
  useEffect(() => {
    if (!workspaceId) {
      
      return;
    }

    

    // Set up the channel subscription with workspace filter
    const channelSubscription = supabase
      .channel('channels')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels',
          filter: `workspace_id=eq.${workspaceId}`
        },
        async (payload) => {
          

          // Handle different types of changes
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setPrivateChannels(prev => prev.filter(channel => channel.id !== deletedId));
              setPublicChannels(prev => prev.filter(channel => channel.id !== deletedId));

              // Reset active channel if it was deleted
              if (activeChannel?.id === deletedId) {
                setActiveChannelWithPersistence(null);
              }
            }
          } else if (payload.eventType === 'INSERT' && payload.new) {
            const newChannel = payload.new as Channel;
            if (newChannel.is_public) {
              setPublicChannels(prev => [...prev, newChannel].sort((a, b) => a.name.localeCompare(b.name)));
            } else {
              // For private channels, add to the list if it belongs to current workspace
              if (newChannel.workspace_id === workspaceId) {
                
                setPrivateChannels(prev => [...prev, newChannel].sort((a, b) => a.name.localeCompare(b.name)));
              }
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedChannel = payload.new as Channel;
            

            // Update the specific channel in the appropriate list
            if (updatedChannel.is_public) {
              setPublicChannels(prev => {
                const updated = prev.map(channel =>
                  channel.id === updatedChannel.id ? { ...channel, ...updatedChannel } : channel
                );
                return updated.sort((a, b) => a.name.localeCompare(b.name));
              });
            } else if (updatedChannel.workspace_id === workspaceId) {
              setPrivateChannels(prev => {
                const updated = prev.map(channel =>
                  channel.id === updatedChannel.id ? { ...channel, ...updatedChannel } : channel
                );
                return updated.sort((a, b) => a.name.localeCompare(b.name));
              });
            }

            // Update active channel if it was modified
            if (activeChannel?.id === updatedChannel.id) {
              setActiveChannelWithPersistence({ ...activeChannel, ...updatedChannel });
            }
          }
        }
      )
      .subscribe((status) => {
        
      });

    // Set up a separate subscription for unread counts
    const unreadSubscription = supabase
      .channel('unread_counts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channel_unread_counts',
          filter: `workspace_id=eq.${workspaceId}`
        },
        async (payload) => {
          

          if (payload.eventType === 'UPDATE' && payload.new) {
            const { channel_id, unread_count } = payload.new;

            // Update the unread count in both public and private channels
            setPublicChannels(prev =>
              prev.map(channel =>
                channel.id === channel_id
                  ? { ...channel, unread_count }
                  : channel
              )
            );

            setPrivateChannels(prev =>
              prev.map(channel =>
                channel.id === channel_id
                  ? { ...channel, unread_count }
                  : channel
              )
            );

            // Update active channel if it was modified
            if (activeChannel?.id === channel_id) {
              // Note: unread_count is not part of Channel type, handled separately
              
            }
          }
        }
      )
      .subscribe((status) => {
        
      });

    return () => {
      
      channelSubscription.unsubscribe();
      unreadSubscription.unsubscribe();
    };
  }, [workspaceId, activeChannel]);

  return {
    publicChannels,
    privateChannels,
    activeChannel,
    setActiveChannel: setActiveChannelWithPersistence
  };
}