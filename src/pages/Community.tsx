import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChannelSidebar } from "@/components/community/ChannelSidebar";
import { ChatArea } from "@/components/community/ChatArea";
import { Channel, Message } from "@/types/community";

export default function Community() {
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch the community workspace ID
  useEffect(() => {
    const fetchWorkspace = async () => {
      const { data: workspace, error } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", "community")
        .single();

      if (error) {
        console.error("Error fetching workspace:", error);
        toast({
          title: "Error",
          description: "Failed to load workspace",
          variant: "destructive",
        });
        return;
      }

      setWorkspaceId(workspace.id);
    };

    fetchWorkspace();
  }, []);

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

  useEffect(() => {
    if (!activeChannel) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq("channel_id", activeChannel.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel(`public:messages:channel_id=eq.${activeChannel.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        (payload) => {
          console.log('Message change received:', payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [activeChannel]);

  const handleSendMessage = async (content: string) => {
    if (!activeChannel || !content.trim()) return;

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          content,
          channel_id: activeChannel.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleCreatePrivateChannel = async (name: string) => {
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "Workspace not loaded",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a channel",
        variant: "destructive",
      });
      return;
    }

    const { data: channel, error } = await supabase
      .from("channels")
      .insert([
        {
          name,
          workspace_id: workspaceId,
          description: `Private channel created by ${user.email}`,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating channel:", error);
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Channel "${name}" created successfully`,
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -mt-20 -mx-8">
      <ChannelSidebar
        publicChannels={publicChannels}
        privateChannels={privateChannels}
        activeChannel={activeChannel}
        onChannelSelect={setActiveChannel}
        onCreatePrivateChannel={handleCreatePrivateChannel}
      />
      <ChatArea 
        activeChannel={activeChannel}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
