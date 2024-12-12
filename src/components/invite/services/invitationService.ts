import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string, email: string) {
  const decodedEmail = decodeURIComponent(email).toLowerCase();

  console.log("Verifying invitation with parameters:", {
    raw_email: email,
    decodedEmail,
    workspaceId,
    currentTime: new Date().toISOString()
  });

  // First, let's check if the invitation exists and log its details
  const { data: allInvitations, error: searchError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail);

  console.log("All matching invitations:", allInvitations);

  if (searchError) {
    console.error("Error searching for invitations:", searchError);
  }

  // Now let's check the specific conditions (pending status and not expired)
  const currentTime = new Date().toISOString();
  console.log("Checking for valid invitation with conditions:", {
    workspaceId,
    email: decodedEmail,
    status: "pending",
    currentTime,
  });

  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .eq("status", "pending")
    .gt("expires_at", currentTime)
    .single();

  console.log("Invitation verification result:", {
    invitation,
    error: inviteError,
    errorCode: inviteError?.code,
    errorMessage: inviteError?.message,
    details: inviteError?.details,
    currentTime
  });

  if (inviteError) {
    console.error("Invitation verification failed:", {
      error: inviteError,
      errorCode: inviteError.code,
      errorMessage: inviteError.message,
      details: inviteError.details,
      conditions: {
        workspaceId,
        email: decodedEmail,
        status: "pending",
        currentTime
      }
    });
    throw new Error("No valid invitation found. Please request a new invitation.");
  }

  if (!invitation) {
    console.error("No invitation found or invitation expired for:", {
      workspaceId,
      email: decodedEmail,
      currentTime
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