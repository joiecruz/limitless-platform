
import { authService } from "@/api";

export async function verifyInvitation(token: string) {
  console.log("🔍 Verifying invitation token:", token);

  try {
    const response = await authService.verifyInvitation(token);
    const invitation = response?.invitation;

    if (!invitation) {
      console.error("❌ No invitation found for token:", token);
      throw new Error("Invalid or expired invitation token.");
    }

    console.log("✅ Valid invitation found:", invitation);
    return { invitation };
    
  } catch (error: any) {
    console.error("❌ Error in verifyInvitation:", error);
    throw error;
  }
}

export async function updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
  console.log("📝 Updating invitation status:", { invitationId, status });

  try {
    const data = await authService.updateInvitationStatus(invitationId, status);
    
    console.log("✅ Invitation status updated successfully", data);
    return data;
    
  } catch (error: any) {
    console.error("❌ Error in updateInvitationStatus:", error);
    throw error;
  }
}
