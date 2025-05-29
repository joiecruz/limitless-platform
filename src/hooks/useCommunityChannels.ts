import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Channel } from "@/types/community";

export function useCommunityChannels(workspaceId: string | null) {
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const { toast } = useToast();

  const fetchPublicChannels = useCallback(async () => {
    console.log("Fetching public channels...");
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("is_public", true)
      .order("name");

    if (error) {
      console.error("Error fetching public channels:", error);
      toast({
        title: "Error",
        description: "Failed to load public channels",
        variant: "destructive",
      });
      return null;
    }

    console.log("Fetched public channels:", data);
    return data;
  }, [toast]);

  const fetchPrivateChannels = useCallback(async () => {
    if (!workspaceId) {
      console.log("No workspace ID provided, skipping private channels fetch");
      setPrivateChannels([]); // Clear private channels when no workspace is selected
      return [];
    }

    console.log("Fetching private channels for workspace:", workspaceId);
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("is_public", false)
      .order("name");

    if (error) {
      console.error("Error fetching private channels:", error);
      toast({
        title: "Error",
        description: "Failed to load private channels",
        variant: "destructive",
      });
      return [];
    }

    console.log("Fetched private channels:", data);
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
      if (workspaceId) {
        const privateData = await fetchPrivateChannels();
        setPrivateChannels(privateData || []);
      }

      // Set default active channel if none is selected
      if (!activeChannel && publicData && publicData.length > 0) {
        console.log("Setting default active channel");
        setActiveChannel(publicData[0]);
      }
    };

    initializeChannels();
  }, [workspaceId, fetchPublicChannels, fetchPrivateChannels, activeChannel]);

  // Subscribe to channel changes
  useEffect(() => {
    if (!workspaceId) {
      console.log("No workspace ID, skipping channel subscription");
      return;
    }

    console.log("Setting up channel subscription for workspace:", workspaceId);

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
          console.log('Channel change received:', payload);

          // Handle different types of changes
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setPrivateChannels(prev => prev.filter(channel => channel.id !== deletedId));
              setPublicChannels(prev => prev.filter(channel => channel.id !== deletedId));

              // Reset active channel if it was deleted
              if (activeChannel?.id === deletedId) {
                setActiveChannel(null);
              }
            }
          } else if (payload.eventType === 'INSERT' && payload.new) {
            const newChannel = payload.new as Channel;
            if (newChannel.is_public) {
              setPublicChannels(prev => [...prev, newChannel].sort((a, b) => a.name.localeCompare(b.name)));
            } else {
              // For private channels, add to the list if it belongs to current workspace
              if (newChannel.workspace_id === workspaceId) {
                console.log("Adding new private channel to workspace:", workspaceId);
                setPrivateChannels(prev => [...prev, newChannel].sort((a, b) => a.name.localeCompare(b.name)));
              }
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedChannel = payload.new as Channel;
            console.log("Channel update received:", updatedChannel);

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
              setActiveChannel(prev => prev ? { ...prev, ...updatedChannel } : null);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Channel subscription status:', status);
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
          console.log('Unread count update received:', payload);

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
              setActiveChannel(prev => prev ? { ...prev, unread_count } : null);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Unread count subscription status:', status);
      });

    return () => {
      console.log("Cleaning up channel subscriptions");
      channelSubscription.unsubscribe();
      unreadSubscription.unsubscribe();
    };
  }, [workspaceId, activeChannel]);

  return {
    publicChannels,
    privateChannels,
    activeChannel,
    setActiveChannel
  };
}