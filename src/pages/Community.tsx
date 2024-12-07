import { useEffect, useState } from "react";
import { Hash, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface Channel {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string | null;
}

export default function Community() {
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      // For now, we'll fetch all channels and split them (you might want to add a 'is_private' column later)
      const { data: channels, error } = await supabase
        .from("channels")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching channels:", error);
        return;
      }

      // Temporary split - first half public, second half private
      // In a real app, you'd have a proper is_private column
      const midPoint = Math.ceil(channels.length / 2);
      setPublicChannels(channels.slice(0, midPoint));
      setPrivateChannels(channels.slice(midPoint));

      // Set first public channel as active by default
      if (channels.length > 0 && !activeChannel) {
        setActiveChannel(channels[0]);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Channels Sidebar */}
      <div className="w-64 bg-gray-800 flex-shrink-0">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">Public Channels</h2>
            <div className="space-y-1">
              {publicChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700 ${
                    activeChannel?.id === channel.id ? "bg-gray-700 text-white" : ""
                  }`}
                  onClick={() => setActiveChannel(channel)}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  {channel.name}
                </Button>
              ))}
            </div>

            <Separator className="my-4 bg-gray-700" />

            <h2 className="text-gray-400 uppercase text-xs font-semibold mb-2">Private Channels</h2>
            <div className="space-y-1">
              {privateChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700 ${
                    activeChannel?.id === channel.id ? "bg-gray-700 text-white" : ""
                  }`}
                  onClick={() => setActiveChannel(channel)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {channel.name}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Channel Header */}
        {activeChannel && (
          <div className="border-b px-6 py-4">
            <div className="flex items-center">
              <Hash className="h-5 w-5 text-gray-500 mr-2" />
              <h1 className="text-xl font-semibold">{activeChannel.name}</h1>
            </div>
            {activeChannel.description && (
              <p className="text-sm text-gray-500 mt-1">{activeChannel.description}</p>
            )}
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {/* Message components will go here */}
            <p className="text-gray-500 text-center">No messages yet</p>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Message #general"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}