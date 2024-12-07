import { Message } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useReactionOperations(messages: Message[], onMessagesUpdate: (messages: Message[]) => void) {
  const { toast } = useToast();

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      console.log("Handling reaction:", { messageId, emoji });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to react to messages",
          variant: "destructive",
        });
        return;
      }

      // Check if user already reacted with this emoji
      const { data: existingReactions, error: fetchError } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (fetchError) throw fetchError;

      if (existingReactions && existingReactions.length > 0) {
        console.log("Removing existing reaction");
        // Remove existing reaction
        const { error: deleteError } = await supabase
          .from('message_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id)
          .eq('emoji', emoji);

        if (deleteError) throw deleteError;

        // Update local state
        const updatedMessages = messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              message_reactions: msg.message_reactions?.filter(
                reaction => !(reaction.user_id === user.id && reaction.emoji === emoji)
              ) || []
            };
          }
          return msg;
        });
        onMessagesUpdate(updatedMessages);
      } else {
        console.log("Adding new reaction");
        // Add new reaction
        const { data: newReaction, error: insertError } = await supabase
          .from('message_reactions')
          .insert([
            {
              message_id: messageId,
              user_id: user.id,
              emoji: emoji,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        // Update local state
        const updatedMessages = messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              message_reactions: [...(msg.message_reactions || []), newReaction]
            };
          }
          return msg;
        });
        onMessagesUpdate(updatedMessages);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to handle reaction",
        variant: "destructive",
      });
    }
  };

  return { handleReaction };
}