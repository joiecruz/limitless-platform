import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) {
    throw new Error("No authenticated user found. Please sign in again.");
  }

  const decodedEmail = session.user.email.toLowerCase();

  // Check if an invitation exists for this email and workspace
  const { data: invitation, error: inviteError } = await supabase
    .from("workspace_invitations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("email", decodedEmail)
    .maybeSingle();

  if (inviteError) {
    console.error("Error verifying invitation:", inviteError);
    throw new Error("Failed to verify invitation. Please try again.");
  }

  if (!invitation) {
    throw new Error("No invitation found for this email address.");
  }

  if (invitation.status === 'accepted') {
    throw new Error("This invitation has already been used.");
  }

  return { invitation, decodedEmail };
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  const { error } = await supabase
    .from("workspace_invitations")
    .update({ status })
    .eq("id", invitationId);

  if (error) throw error;
}