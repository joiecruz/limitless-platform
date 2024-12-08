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
      console.log("Fetching messages for channel:", activeChannel.id);
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            first_name,
            last_name
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

      console.log("Fetched messages:", data?.length || 0);
      setMessages(data || []);
    };

    // Initial fetch
    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`messages:${activeChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          // Fetch the complete message with profiles and reactions
          const { data, error } = await supabase
            .from("messages")
            .select(`
              *,
              profiles (
                username,
                avatar_url,
                first_name,
                last_name
              ),
              message_reactions (
                id,
                emoji,
                user_id
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (!error && data) {
            setMessages(current => [...current, data]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        (payload) => {
          console.log('Message deleted:', payload);
          setMessages(current => 
            current.filter(msg => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount or channel change
    return () => {
      console.log("Cleaning up message subscription");
      subscription.unsubscribe();
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