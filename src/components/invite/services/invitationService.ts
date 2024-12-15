import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(token: string) {
  console.log("🔍 TOKEN VERIFICATION START", {
    token,
    timestamp: new Date().toISOString()
  });

  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .single({
      headers: {
        'x-invite-token': token
      }
    });

  if (inviteError) {
    console.error("❌ INVITATION ERROR:", {
      error: inviteError,
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