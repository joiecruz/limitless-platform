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
    if (!workspaceId) return;

    const fetchChannels = async () => {
      const { data: channels, error } = await supabase
        .from("channels")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("name");

      if (error) {
        console.error("Error fetching channels:", error);
        toast({
          title: "Error",
          description: "Failed to load channels",
          variant: "destructive",
        });
        return;
      }

      // Split channels into public and private (for demo, first half public, second half private)
      const midPoint = Math.ceil(channels.length / 2);
      setPublicChannels(channels.slice(0, midPoint));
      setPrivateChannels(channels.slice(midPoint));

      if (channels.length > 0 && !activeChannel) {
        setActiveChannel(channels[0]);
      }
    };

    fetchChannels();

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