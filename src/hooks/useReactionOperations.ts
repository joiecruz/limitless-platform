import { Message } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface UseReactionOperationsProps {
  onMessageUpdate?: (message: Message) => void;
}

export function useReactionOperations({ onMessageUpdate }: UseReactionOperationsProps = {}) {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up reaction subscription");

    const subscription = supabase
      .channel('message_reactions')
      .on(
        'postgres_changes',
        {
          event: '*',  // Listen to all events
          schema: 'public',
          table: 'message_reactions'
        },
        async (payload) => {
          console.log('=== Reaction event payload ===');
          console.log('Event type:', payload.eventType);
          console.log('Full payload:', JSON.stringify(payload, null, 2));
          console.log('Old data type:', typeof payload.old);
          console.log('Old data:', payload.old);
          console.log('Old data keys:', payload.old ? Object.keys(payload.old) : []);
          console.log('New data:', payload.new);

          let messageId: string | undefined;

          if (payload.eventType === 'DELETE') {
            // For DELETE events, we can just fetch the updated message directly
            const { data: updatedMessage, error } = await supabase
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
              .eq("id", (payload.old as any)?.message_id)
              .single();

            if (error) {
              console.error("Error fetching updated message:", error);
              return;
            }

            if (updatedMessage && onMessageUpdate) {
              console.log('Updating message with new reaction data:', updatedMessage);
              onMessageUpdate(updatedMessage);
            }
            return;
          }

          // For INSERT/UPDATE events
          messageId = (payload.new as any)?.message_id;
          console.log('INSERT/UPDATE event - message ID from new:', messageId);

          if (!messageId) {
            console.error("No message ID found in reaction payload:", payload);
            return;
          }

          // For all events, fetch the complete message data to ensure consistency
          const { data: updatedMessage, error } = await supabase
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
            .eq("id", messageId)
            .single();

          if (error) {
            console.error("Error fetching updated message:", error);
            return;
          }

          if (updatedMessage && onMessageUpdate) {
            console.log('Updating message with new reaction data:', updatedMessage);
            onMessageUpdate(updatedMessage);
          }
        }
      )
      .subscribe((status) => {
        console.log('Reaction subscription status:', status);
      });

    return () => {
      console.log("Cleaning up reaction subscription");
      subscription.unsubscribe();
    };
  }, [onMessageUpdate]);

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      console.log("=== Starting handleReaction ===");
      console.log("Input parameters:", { messageId, emoji });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, returning early");
        toast({
          title: "Error",
          description: "You must be logged in to react to messages",
          variant: "destructive",
        });
        return;
      }
      console.log("Current user:", user.id);

      // Check if user already reacted with this emoji
      console.log("Checking for existing reactions...");
      const { data: existingReactions, error: fetchError } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (fetchError) {
        console.error("Error fetching existing reactions:", fetchError);
        throw fetchError;
      }

      console.log("Existing reactions found:", existingReactions);

      if (existingReactions && existingReactions.length > 0) {
        console.log("=== Found existing reaction, attempting deletion ===");
        const reactionToDelete = existingReactions[0];
        console.log("Reaction to delete:", {
          id: reactionToDelete.id,
          message_id: reactionToDelete.message_id,
          user_id: reactionToDelete.user_id,
          emoji: reactionToDelete.emoji
        });

        // Store message_id before deletion
        const messageId = reactionToDelete.message_id;

        // Remove existing reaction
        console.log("Sending delete request to Supabase...");
        const { error: deleteError } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', reactionToDelete.id);

        if (deleteError) {
          console.error("Error deleting reaction:", deleteError);
          throw deleteError;
        }

        // After successful deletion, fetch the updated message
        const { data: updatedMessage, error: fetchError } = await supabase
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
          .eq("id", messageId)
          .single();

        if (fetchError) {
          console.error("Error fetching updated message:", fetchError);
          return;
        }

        if (updatedMessage && onMessageUpdate) {
          console.log("Updating message state with:", updatedMessage);
          onMessageUpdate(updatedMessage);
        }

        console.log("=== Reaction removal complete ===");
      } else {
        console.log("=== No existing reaction found, adding new reaction ===");
        // Add new reaction
        const { error: insertError } = await supabase
          .from('message_reactions')
          .insert([
            {
              message_id: messageId,
              user_id: user.id,
              emoji: emoji,
            },
          ]);

        if (insertError) {
          console.error("Error inserting reaction:", insertError);
          throw insertError;
        }

        console.log("=== New reaction added ===");
      }
    } catch (error) {
      console.error('=== Error in handleReaction ===', error);
      toast({
        title: "Error",
        description: "Failed to handle reaction",
        variant: "destructive",
      });
    }
  };

  return { handleReaction };
}