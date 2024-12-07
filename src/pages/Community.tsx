import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChannelSidebar } from "@/components/community/ChannelSidebar";
import { ChatArea } from "@/components/community/ChatArea";
import { Channel } from "@/types/community";

export default function Community() {
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      const { data: channels, error } = await supabase
        .from("channels")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching channels:", error);
        return;
      }

      const midPoint = Math.ceil(channels.length / 2);
      setPublicChannels(channels.slice(0, midPoint));
      setPrivateChannels(channels.slice(midPoint));

      if (channels.length > 0 && !activeChannel) {
        setActiveChannel(channels[0]);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      <ChannelSidebar
        publicChannels={publicChannels}
        privateChannels={privateChannels}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
      />
      <ChatArea activeChannel={activeChannel} />
    </div>
  );
}