import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(token: string) {
  console.log("🔍 TOKEN VERIFICATION START", {
    token,
    timestamp: new Date().toISOString()
  });

  const query = supabase
    .from("workspace_invitations")
    .select("*")
    .eq('magic_link_token', token)
    .single();

  // Log the generated SQL query
  console.log("🔍 GENERATED QUERY:", {
    query: query.toSQL(), // This will show the actual SQL being executed
    timestamp: new Date().toISOString()
  });

  const { data: invitation, error: inviteError } = await query;

  if (inviteError) {
    console.error("❌ INVITATION ERROR:", {
      error: inviteError,
      errorCode: inviteError.code,
      errorMessage: inviteError.message,
      token,
      timestamp: new Date().toISOString()
    });
    throw new Error("Failed to verify invitation. Please try again.");
  }

  if (!invitation) {
    console.error("❌ NO INVITATION FOUND FOR TOKEN:", {
      token,
      timestamp: new Date().toISOString()
    });
    throw new Error("Invalid or expired invitation token.");
  }

  console.log("✅ VALID INVITATION FOUND:", {
    invitation,
    timestamp: new Date().toISOString()
  });

  return { invitation };
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
      errorCode: updateError.code,
      errorMessage: updateError.message,
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