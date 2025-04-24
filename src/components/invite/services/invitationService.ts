
import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(token: string) {
  console.log("🔍 Verifying invitation token:", token);

  // When retrieving the invitation, we need to use the anon role which has permissions
  // to read invitations by token (as the user might not be authenticated yet)
  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq('magic_link_token', token)
    .maybeSingle();

  if (inviteError) {
    console.error("❌ Error verifying invitation:", {
      error: inviteError,
      errorCode: inviteError.code,
      errorMessage: inviteError.message,
      token,
    });
    throw new Error("Failed to verify invitation. Please try again.");
  }

  if (!invitation) {
    console.error("❌ No invitation found for token:", token);
    throw new Error("Invalid or expired invitation token.");
  }

  if (invitation.status !== 'pending') {
    console.error("❌ Invitation is not pending:", invitation.status);
    throw new Error("This invitation has already been used or has expired.");
  }

  console.log("✅ Valid invitation found:", invitation);

  return { invitation };
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  console.log("📝 Updating invitation status:", {
    invitationId,
    status,
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to update an invitation.");
  }

  // First, get the invitation to check permissions
  const { data: invitation, error: getError } = await supabase
    .from("workspace_invitations")
    .select("email")
    .eq("id", invitationId)
    .single();

  if (getError) {
    console.error("❌ Error getting invitation:", getError);
    throw getError;
  }

  // Check if the user's email matches the invitation email
  if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    console.error("❌ User email does not match invitation email");
    throw new Error("You don't have permission to update this invitation.");
  }

  // Update the invitation status
  const { error: updateError } = await supabase
    .from("workspace_invitations")
    .update({ 
      status,
      accepted_at: status === 'accepted' ? new Date().toISOString() : null
    })
    .eq("id", invitationId);

  if (updateError) {
    console.error("❌ Error updating invitation status:", {
      error: updateError,
      errorCode: updateError.code,
      errorMessage: updateError.message,
      invitationId,
      status,
    });
    throw updateError;
  }

  console.log("✅ Invitation status updated successfully");
}
