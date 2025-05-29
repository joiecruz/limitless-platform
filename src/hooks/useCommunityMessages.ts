import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Channel, Message } from "@/types/community";

export function useCommunityMessages(activeChannel: Channel | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!activeChannel) {
      console.log("No active channel, skipping message subscription");
      setMessages([]); // Clear messages when no active channel
      return;
    }

    console.log("Setting up message subscription for channel:", activeChannel.id, "is_public:", activeChannel.is_public);

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

      console.log("Fetched messages:", data?.length || 0, "for channel:", activeChannel.id);
      setMessages(data || []);
    };

    // Initial fetch
    fetchMessages();

    // Set up real-time subscription for new messages
    const channelName = `messages:${activeChannel.id}`;
    console.log("Creating subscription channel:", channelName);

    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        async (payload) => {
          console.log('New message received for channel:', activeChannel.id, 'Payload:', payload);

          // Only fetch additional data if we don't have the profile info
          // This reduces unnecessary database calls
          const newMessage = payload.new as Message;

          // Check if we need to fetch profile data
          const needsProfileData = !newMessage.profiles;

          if (needsProfileData) {
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
              .eq("id", newMessage.id)
              .single();

            if (error) {
              console.error("Error fetching new message details:", error);
              return;
            }

            if (data) {
              console.log("Adding new message with fetched profile data:", data);
              setMessages(current => [...current, data]);
            }
          } else {
            // Use the message data directly from the payload
            console.log("Adding new message from payload:", newMessage);
            setMessages(current => [...current, newMessage]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        },
        (payload) => {
          console.log('Message updated in channel:', activeChannel.id, 'Payload:', payload);
          const updatedMessage = payload.new as Message;

          setMessages(current =>
            current.map(msg =>
              msg.id === updatedMessage.id
                ? { ...msg, ...updatedMessage }
                : msg
            )
          );
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
          console.log('Message deleted from channel:', activeChannel.id, 'Payload:', payload);
          setMessages(current =>
            current.filter(msg => msg.id !== payload.old.id)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=in.(select id from messages where channel_id=eq.${activeChannel.id})`
        },
        (payload) => {
          console.log('Reaction added:', payload);
          const newReaction = payload.new as { id: string; emoji: string; user_id: string; message_id: string };

          setMessages(current =>
            current.map(msg => {
              if (msg.id !== newReaction.message_id) return msg;

              // Check if reaction already exists by ID to prevent duplicates
              const reactionExists = (msg.message_reactions || []).some(
                reaction => reaction.id === newReaction.id
              );

              if (reactionExists) return msg;

              return {
                ...msg,
                message_reactions: [
                  ...(msg.message_reactions || []),
                  newReaction
                ]
              };
            })
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=in.(select id from messages where channel_id=eq.${activeChannel.id})`
        },
        (payload) => {
          console.log('Reaction removed:', payload);
          const deletedReaction = payload.old as { id: string; emoji: string; user_id: string; message_id: string };

          setMessages(current =>
            current.map(msg => {
              if (msg.id !== deletedReaction.message_id) return msg;

              return {
                ...msg,
                message_reactions: (msg.message_reactions || [])
                  .filter(reaction => reaction.id !== deletedReaction.id)
              };
            })
          );
        }
      )
      .subscribe((status) => {
        console.log('Subscription status for channel:', activeChannel.id, 'Status:', status);

        if (status === 'CHANNEL_ERROR') {
          console.error('Subscription error for channel:', activeChannel.id);
          toast({
            title: "Connection Error",
            description: "Real-time updates temporarily unavailable",
            variant: "destructive",
          });
        }
      });

    // Cleanup subscription on unmount or channel change
    return () => {
      console.log("Cleaning up message subscription for channel:", activeChannel.id);
      subscription.unsubscribe();
    };
  }, [activeChannel?.id]); // Only depend on channel ID to prevent unnecessary re-subscriptions

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!activeChannel || (!content.trim() && !imageUrl)) {
      console.log("Cannot send message: No active channel or empty content");
      return;
    }

    console.log("Sending message to channel:", activeChannel.id);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("messages")
        .insert([
          {
            content,
            image_url: imageUrl,
            channel_id: activeChannel.id,
            user_id: userData.user.id,
          },
        ]);

      if (error) {
        throw error;
      }

      console.log("Message sent successfully to channel:", activeChannel.id);
    } catch (error) {
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