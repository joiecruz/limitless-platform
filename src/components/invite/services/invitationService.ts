import { supabase } from "@/integrations/supabase/client";

export async function verifyInvitation(workspaceId: string) {
  const { data: invitation, error } = await supabase
    .from('workspace_invitations')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('status', 'pending')
    .single();

  if (error) {
    console.error('Error verifying invitation:', error);
    throw new Error('Invalid or expired invitation');
  }

  if (!invitation) {
    throw new Error('Invitation not found or already used');
  }

  return { invitation, decodedEmail: decodeURIComponent(invitation.email).toLowerCase() };
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected' | 'expired') {
  const { error } = await supabase
    .from('workspace_invitations')
    .update({ status })
    .eq('id', invitationId);

  if (error) {
    console.error('Error updating invitation status:', error);
    throw new Error('Failed to update invitation status');
  }
}