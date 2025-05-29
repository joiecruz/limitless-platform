import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ProfileData {
  first_name: string;
  last_name: string;
  role: string;
  company_size: string;
  goals: string[] | string;
  referral_source: string;
}

export class ProfileService {
  /**
   * Check if a user's email is verified
   */
  static async getVerificationStatus(user: User): Promise<boolean> {
    return !!user.email_confirmed_at;
  }

  /**
   * Check if a user can create a profile
   * Regular users need email verification, invited users can bypass
   */
  static async canCreateProfile(user: User): Promise<{ canCreate: boolean; reason?: string }> {
    // Check if user is marked as invited (bypasses verification)
    const isInvited = user.user_metadata?.is_invited === true;

    if (isInvited) {
      return { canCreate: true };
    }

    // Regular users must have verified email
    const isVerified = await this.getVerificationStatus(user);
    if (!isVerified) {
      return {
        canCreate: false,
        reason: "Email verification required before creating profile"
      };
    }

    return { canCreate: true };
  }

  /**
   * Convert goals array to string if needed
   */
  private static formatGoals(goals: string[] | string): string {
    return Array.isArray(goals) ? goals.join(', ') : goals;
  }

  /**
   * Create a profile with verification checks
   */
  static async createVerifiedProfile(user: User, profileData: ProfileData): Promise<void> {
    // Check if profile creation is allowed
    const { canCreate, reason } = await this.canCreateProfile(user);
    if (!canCreate) {
      throw new Error(reason || "Profile creation not allowed");
    }

    // Create the profile
    const { error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        role: profileData.role,
        company_size: profileData.company_size,
        goals: this.formatGoals(profileData.goals),
        referral_source: profileData.referral_source
      });

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Update an existing profile with verification checks
   */
  static async updateVerifiedProfile(user: User, profileData: Partial<ProfileData>): Promise<void> {
    // Check if profile operations are allowed
    const { canCreate, reason } = await this.canCreateProfile(user);
    if (!canCreate) {
      throw new Error(reason || "Profile operations not allowed");
    }

    // Prepare update data
    const updateData: any = {};
    if (profileData.first_name !== undefined) updateData.first_name = profileData.first_name;
    if (profileData.last_name !== undefined) updateData.last_name = profileData.last_name;
    if (profileData.role !== undefined) updateData.role = profileData.role;
    if (profileData.company_size !== undefined) updateData.company_size = profileData.company_size;
    if (profileData.goals !== undefined) updateData.goals = this.formatGoals(profileData.goals);
    if (profileData.referral_source !== undefined) updateData.referral_source = profileData.referral_source;

    // Update the profile
    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}