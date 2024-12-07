import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Channel } from "@/types/community";

export function useCommunityChannels(workspaceId: string | null) {
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChannels = async () => {
      // Fetch public channels (is_public = true)
      const { data: publicData, error: publicError } = await supabase
        .from("channels")
        .select("*")
        .eq("is_public", true)
        .order("name");

      if (publicError) {
        console.error("Error fetching public channels:", publicError);
        toast({
          title: "Error",
          description: "Failed to load public channels",
          variant: "destructive",
        });
        return;
      }

      setPublicChannels(publicData || []);

      // Fetch private channels for the current workspace
      if (workspaceId) {
        const { data: privateData, error: privateError } = await supabase
          .from("channels")
          .select("*")
          .eq("workspace_id", workspaceId)
          .eq("is_public", false)
          .order("name");

        if (privateError) {
          console.error("Error fetching private channels:", privateError);
          toast({
            title: "Error",
            description: "Failed to load private channels",
            variant: "destructive",
          });
          return;
        }

        setPrivateChannels(privateData || []);

        // If active channel was deleted, reset it
        if (activeChannel && !privateData?.find(channel => channel.id === activeChannel.id)) {
          setActiveChannel(null);
        }
      }

      // Set active channel to first public channel if none is selected
      if (!activeChannel && publicData && publicData.length > 0) {
        setActiveChannel(publicData[0]);
      }
    };

    fetchChannels();

    // Subscribe to channel changes
    const channelSubscription = supabase
      .channel('channels')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels'
        },
        (payload) => {
          console.log('Channel change received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setPrivateChannels(prev => prev.filter(channel => channel.id !== deletedId));
              setPublicChannels(prev => prev.filter(channel => channel.id !== deletedId));
              
              // If active channel was deleted, reset it
              if (activeChannel?.id === deletedId) {
                setActiveChannel(null);
              }
            }
          } else {
            // For INSERT and UPDATE, fetch all channels again
            fetchChannels();
          }
        }
      )
      .subscribe();

    return () => {
      channelSubscription.unsubscribe();
    };
  }, [workspaceId]);

  return {
    publicChannels,
    privateChannels,
    activeChannel,
    setActiveChannel
  };
}