
import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(token: string) {
  console.log("🔍 Verifying invitation token:", token);

  try {
    // Use an edge function to validate the token without RLS issues
    const { data: invitation, error: inviteError } = await supabase.functions.invoke('verify-invitation', {
      body: { token }
    });

    if (inviteError) {
      console.error("❌ Error verifying invitation:", inviteError);
      throw new Error("Failed to verify invitation. Please try again.");
    }

    if (!invitation) {
      console.error("❌ No invitation found for token:", token);
      throw new Error("Invalid or expired invitation token.");
    }

    console.log("✅ Valid invitation found:", invitation);

    return { invitation };
  } catch (error: any) {
    console.error("❌ Error in verifyInvitation:", error);
    throw error;
  }
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  console.log("📝 Updating invitation status:", {
    invitationId,
    status,
  });

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
      console.error("❌ Error updating invitation status:", error);
      throw error;
    }

    console.log("✅ Invitation status updated successfully", data);
    return data;
    
  } catch (error: any) {
    console.error("❌ Error in updateInvitationStatus:", error);
    throw error;
  }
}
