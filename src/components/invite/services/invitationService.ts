import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string, email: string) {
  const decodedEmail = decodeURIComponent(email).toLowerCase();

  console.log("Querying workspace_invitations with:", {
    workspace_id: workspaceId,
    email: decodedEmail,
    currentTime: new Date().toISOString()
  });

  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .single();

  console.log("Raw invitation query result:", { invitation, inviteError });

  if (inviteError) {
    console.error("Invitation verification failed:", {
      error: inviteError,
      errorCode: inviteError.code,
      errorMessage: inviteError.message,
      details: inviteError.details
    });
    throw new Error("No valid invitation found. Please request a new invitation.");
  }

  if (!invitation) {
    console.error("No invitation found or invitation expired for:", {
      workspaceId,
      email: decodedEmail,
      currentTime: new Date().toISOString()
    });
    throw new Error("No valid invitation found or invitation has expired. Please request a new invitation.");
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