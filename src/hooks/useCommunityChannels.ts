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
      }

      // Set active channel to first public channel if none is selected
      if (!activeChannel && publicData && publicData.length > 0) {
        setActiveChannel(publicData[0]);
      }
    };

    fetchChannels();

    // Subscribe to channel changes
    const channelSubscription = supabase
      .channel('public:channels')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'channels' },
        (payload) => {
          console.log('Channel change received:', payload);
          fetchChannels();
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