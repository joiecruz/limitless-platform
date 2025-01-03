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

  const handleWorkspaceChange = useCallback(async () => {
    console.log("Handling workspace change. Current workspace:", workspaceId);
    
    // Reset private channels when workspace changes
    setPrivateChannels([]);
    
    // Reset active channel if it was private
    if (activeChannel && !activeChannel.is_public) {
      console.log("Resetting active channel as it was private");
      setActiveChannel(null);
    }

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
  }, [workspaceId, activeChannel, fetchPublicChannels, fetchPrivateChannels]);

  // Subscribe to channel changes
  useEffect(() => {
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
          filter: workspaceId ? `workspace_id=eq.${workspaceId}` : undefined
        },
        async (payload) => {
          console.log('Channel change received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              // For private channels, only remove if it belongs to current workspace
              if (!payload.old.is_public && payload.old.workspace_id !== workspaceId) {
                return;
              }
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
            } else if (newChannel.workspace_id === workspaceId) {
              console.log("Adding new private channel to workspace:", workspaceId);
              setPrivateChannels(prev => [...prev, newChannel].sort((a, b) => a.name.localeCompare(b.name)));
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedChannel = payload.new as Channel;
            // For private channels, only update if it belongs to current workspace
            if (!updatedChannel.is_public && updatedChannel.workspace_id !== workspaceId) {
              return;
            }
            // Refresh channels to ensure proper filtering
            console.log("Refreshing channels after update");
            await handleWorkspaceChange();
          }
        }
      )
      .subscribe();

    // Initial fetch
    handleWorkspaceChange();

    return () => {
      console.log("Cleaning up channel subscription");
      channelSubscription.unsubscribe();
    };
  }, [workspaceId, handleWorkspaceChange, activeChannel]);

  return {
    publicChannels,
    privateChannels,
    activeChannel,
    setActiveChannel
  };
}