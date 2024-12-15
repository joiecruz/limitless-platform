import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string, email: string) {
  const decodedEmail = decodeURIComponent(email).toLowerCase();

  console.log("🔍 Verifying invitation:", {
    workspaceId,
    decodedEmail,
    timestamp: new Date().toISOString()
  });

  // Check if an invitation exists for this email and workspace
  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .eq("status", "pending")
    .single();

  if (inviteError) {
    console.error("❌ Error verifying invitation:", {
      error: inviteError,
      workspaceId,
      decodedEmail,
      timestamp: new Date().toISOString()
    });
    throw new Error("Failed to verify invitation");
  }

  if (!invitation) {
    console.error("❌ No valid invitation found:", {
      workspaceId,
      decodedEmail,
      timestamp: new Date().toISOString()
    });
    throw new Error("No valid invitation found for this email address");
  }

  // Check if invitation has expired
  if (new Date(invitation.expires_at) < new Date()) {
    console.error("❌ Invitation expired:", {
      expiryDate: invitation.expires_at,
      timestamp: new Date().toISOString()
    });
    throw new Error("This invitation has expired");
  }

  console.log("✅ Valid invitation found:", {
    invitation,
    timestamp: new Date().toISOString()
  });

  return { invitation, decodedEmail };
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  console.log("📝 Updating invitation status:", {
    invitationId,
    status,
    timestamp: new Date().toISOString()
  });

  const { error } = await supabase
    .from("workspace_invitations")
    .update({ 
      status,
      accepted_at: status === 'accepted' ? new Date().toISOString() : null 
    })
    .eq("id", invitationId);

  if (error) {
    console.error("❌ Error updating invitation status:", {
      error,
      invitationId,
      status,
      timestamp: new Date().toISOString()
    });
    throw error;
  }

  console.log("✅ Invitation status updated successfully");
}