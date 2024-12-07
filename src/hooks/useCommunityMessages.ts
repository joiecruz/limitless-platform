import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Channel, Message } from "@/types/community";

export function useCommunityMessages(activeChannel: Channel | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

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
          ),
          message_reactions (
            id,
            emoji,
            user_id
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
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        (payload) => {
          console.log('Message inserted:', payload);
          fetchMessages();
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        (payload) => {
          console.log('Message deleted:', payload);
          setMessages(currentMessages => 
            currentMessages.filter(msg => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Also subscribe to reactions
    const reactionSubscription = supabase
      .channel('public:message_reactions')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        },
        (payload) => {
          console.log('Reaction change received:', payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
      reactionSubscription.unsubscribe();
    };
  }, [activeChannel]);

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!activeChannel || (!content.trim() && !imageUrl)) return;

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          content,
          image_url: imageUrl,
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

  return { messages, sendMessage };
}