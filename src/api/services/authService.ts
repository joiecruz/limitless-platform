
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const authService = {
  /**
   * Gets the current user session
   */
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Gets the current user
   */
  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Signs in a user with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Signs up a user with email and password
   */
  async signUp(email: string, password: string, userData?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Signs out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Sends a password reset email
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  },

  /**
   * Verify invitation token
   */
  async verifyInvitation(token: string) {
    return apiClient.invoke('verify-invitation', { token });
  },

  /**
   * Update invitation status
   */
  async updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to update an invitation.");
    }
    
    return apiClient.invoke('update-invitation-status', {
      invitation_id: invitationId,
      status,
      user_id: user.id
    });
  }
};
