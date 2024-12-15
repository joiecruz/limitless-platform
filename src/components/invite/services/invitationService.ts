import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string, email: string) {
  const decodedEmail = decodeURIComponent(email).toLowerCase();

  console.log("🔍 INVITATION VERIFICATION START", {
    rawEmail: email,
    decodedEmail,
    workspaceId,
    timestamp: new Date().toISOString()
  });

  // Extract token from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  // Check if an invitation exists for this email and workspace
  const query = supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .maybeSingle();

  // Add headers if token exists
  if (token) {
    query.headers({
      'x-invite-token': token
    });
  }

  const { data: invitation, error: inviteError } = await query;

  console.log("📬 INVITATION QUERY RESULT:", {
    invitation,
    error: inviteError,
    emailUsedInQuery: decodedEmail,
    timestamp: new Date().toISOString()
  });

  if (inviteError) {
    console.error("❌ INVITATION ERROR:", {
      error: inviteError,
      decodedEmail,
      workspaceId,
      timestamp: new Date().toISOString()
    });
    throw new Error("Failed to verify invitation. Please try again.");
  }

  if (!invitation) {
    // Query the table directly to see what invitations exist
    const { data: allInvites } = await supabase
      .from("workspace_invitations")
      .select("*")
      .eq("workspace_id", workspaceId);
    
    console.error("❌ NO INVITATION FOUND:", {
      decodedEmail,
      workspaceId,
      existingInvites: allInvites,
      timestamp: new Date().toISOString()
    });
    throw new Error("No invitation found for this email address. Please request a new invitation.");
  }

  // Only check if the invitation has been used
  if (invitation.status === 'accepted') {
    console.error("❌ INVITATION ALREADY USED:", {
      status: invitation.status,
      decodedEmail,
      timestamp: new Date().toISOString()
    });
    throw new Error("This invitation has already been used. Please request a new invitation.");
  }

  console.log("✅ VALID INVITATION FOUND:", {
    invitation,
    timestamp: new Date().toISOString()
  });

  return { invitation, decodedEmail };
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  console.log("📝 UPDATING INVITATION STATUS:", {
    invitationId,
    status,
    timestamp: new Date().toISOString()
  });

  const { error: updateError } = await supabase
    .from("workspace_invitations")
    .update({ status })
    .eq("id", invitationId);

  if (updateError) {
    console.error("❌ INVITATION UPDATE ERROR:", {
      error: updateError,
      invitationId,
      status,
      timestamp: new Date().toISOString()
    });
    throw updateError;
  }

  console.log("✅ INVITATION STATUS UPDATED:", {
    invitationId,
    status,
    timestamp: new Date().toISOString()
  });
}