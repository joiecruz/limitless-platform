
import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(token: string) {
  

  try {
    // Use an edge function to validate the token without RLS issues
    const { data: invitation, error: inviteError } = await supabase.functions.invoke('verify-invitation', {
      body: { token }
    });

    if (inviteError) {
      
      throw new Error("Failed to verify invitation. Please try again.");
    }

    if (!invitation) {
      
      throw new Error("Invalid or expired invitation token.");
    }

    

    return { invitation };
  } catch (error: any) {
    
    throw error;
  }
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to update an invitation.");
    }

    // Use a function to update invitation status
    const { data, error } = await supabase.functions.invoke('update-invitation-status', {
      body: {
        invitation_id: invitationId,
        status,
        user_id: user.id
      }
    });

    if (error) {
      
      throw error;
    }

    
    return data;
    
  } catch (error: any) {
    
    throw error;
  }
}
