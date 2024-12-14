import { supabase } from "@/integrations/supabase/client";
import { InviteFormData } from "../types";
import { createNewUser } from "./userService";

export async function verifyInvitation(invitationId: string) {
  const { data: invitation, error } = await supabase
    .from('workspace_invitations')
    .select('*')
    .eq('id', invitationId)
    .eq('status', 'pending')
    .single();

  if (error) {
    console.error('Error verifying invitation:', error);
    throw new Error('Invalid or expired invitation');
  }

  if (!invitation) {
    throw new Error('Invitation not found or already used');
  }

  return invitation;
}

export async function acceptInvitation(
  invitationId: string,
  formData: InviteFormData
) {
  try {
    const invitation = await verifyInvitation(invitationId);

    // Create the user account
    const createUserResult = await createNewUser(
      invitation.email,
      formData.password,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        companySize: formData.companySize,
        referralSource: formData.referralSource,
        goals: formData.goals
      }
    );

    if (!createUserResult.success) {
      throw new Error(createUserResult.error || 'Failed to create user account');
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from('workspace_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId);

    if (updateError) {
      console.error('Error updating invitation status:', updateError);
      throw new Error('Failed to update invitation status');
    }

    return {
      success: true,
      message: 'Please check your email to confirm your account before signing in.'
    };
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
}