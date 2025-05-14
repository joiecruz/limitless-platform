
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const messageService = {
  /**
   * Get messages for a channel
   */
  async getChannelMessages(channelId: string) {
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
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },
  
  /**
   * Send a message
   */
  async sendMessage(channelId: string, content: string, imageUrl?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          content,
          image_url: imageUrl,
          channel_id: channelId,
          user_id: user.id,
        },
      ]);

    if (error) throw error;
  },
  
  /**
   * Delete a message
   */
  async deleteMessage(messageId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // First delete all reactions for this message
    const { error: reactionsError } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId);

    if (reactionsError) throw reactionsError;

    // Then delete the message
    const { error: messageError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('user_id', user.id);

    if (messageError) throw messageError;
  },
  
  /**
   * Add or remove a reaction
   */
  async toggleReaction(messageId: string, emoji: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Check if user already reacted with this emoji
    const { data: existingReactions, error: fetchError } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .eq('emoji', emoji);

    if (fetchError) throw fetchError;

    if (existingReactions && existingReactions.length > 0) {
      // Remove existing reaction
      const { error: deleteError } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (deleteError) throw deleteError;
      
      return { added: false, removed: true };
    } else {
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
      return { added: true, removed: false, reaction: newReaction };
    }
  }
};
