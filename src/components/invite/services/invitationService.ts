import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string, email: string) {
  const decodedEmail = decodeURIComponent(email).toLowerCase();

  console.log("Starting invitation verification for:", {
    email: decodedEmail,
    workspaceId
  });

  // First, just check if an invitation exists for this email and workspace
  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .single();

  if (inviteError || !invitation) {
    console.error("No invitation found for this email and workspace:", {
      email: decodedEmail,
      workspaceId,
      error: inviteError
    });
    throw new Error("No invitation found for this email address. Please request a new invitation.");
  }

  console.log("Found invitation:", invitation);

  // Now check if the invitation is still valid
  const currentTime = new Date().toISOString();
  if (invitation.status !== "pending") {
    console.error("Invitation is not pending:", {
      status: invitation.status,
      email: decodedEmail
    });
    throw new Error("This invitation has already been used. Please request a new invitation.");
  }

  if (new Date(invitation.expires_at) < new Date()) {
    console.error("Invitation has expired:", {
      expiresAt: invitation.expires_at,
      currentTime,
      email: decodedEmail
    });
    throw new Error("This invitation has expired. Please request a new invitation.");
  }

  return { invitation, decodedEmail };
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  const { error: updateError } = await supabase
    .from("workspace_invitations")
    .update({ status })
    .eq("id", invitationId);

  if (updateError) {
    console.error("Error updating invitation status:", updateError);
    throw updateError;
  }
}