import { Message, MessageReaction } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// Global user cache to avoid repeated auth calls
const globalUserCache = new Map<string, any>();

interface UseReactionOperationsProps {
  onMessageUpdate?: (message: Message) => void;
}

export function useReactionOperations({ onMessageUpdate }: UseReactionOperationsProps = {}) {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (!globalUserCache.has('currentUser')) {
        const { data: { user } } = await supabase.auth.getUser();
        globalUserCache.set('currentUser', user?.id || null);
      }
      setCurrentUserId(globalUserCache.get('currentUser'));
    };
    getCurrentUser();
  }, []);

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!currentUserId) {
        toast({
          title: "Error",
          description: "You must be logged in to react to messages",
          variant: "destructive",
        });
        return;
      }

    try {
      // Check if user already reacted with this emoji
      const { data: existingReactions, error: fetchError } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', currentUserId)
        .eq('emoji', emoji)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingReactions && existingReactions.length > 0) {
        // Remove existing reaction
        const { error: deleteError } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReactions[0].id);

        if (deleteError) throw deleteError;
      } else {
        // Add new reaction
        const { error: insertError } = await supabase
          .from('message_reactions')
          .insert([
            {
              message_id: messageId,
              user_id: currentUserId,
              emoji: emoji,
            },
          ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to handle reaction",
        variant: "destructive",
      });
    }
  };

  return { handleReaction };
}