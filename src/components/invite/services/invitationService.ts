import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string, email: string) {
  const decodedEmail = decodeURIComponent(email).toLowerCase();

  console.log("🔍 INVITATION VERIFICATION START", {
    rawEmail: email,
    decodedEmail,
    workspaceId,
    timestamp: new Date().toISOString()
  });

  // Check if an invitation exists for this email and workspace
  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .eq("status", "pending") // Explicitly check for pending status
    .maybeSingle();

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

  // Check if the invitation has expired
  if (new Date(invitation.expires_at) < new Date()) {
    console.error("❌ INVITATION EXPIRED:", {
      expiryDate: invitation.expires_at,
      timestamp: new Date().toISOString()
    });
    throw new Error("This invitation has expired. Please request a new invitation.");
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
    .update({ 
      status,
      accepted_at: status === 'accepted' ? new Date().toISOString() : null 
    })
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