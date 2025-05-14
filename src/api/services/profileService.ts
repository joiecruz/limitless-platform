
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const profileService = {
  /**
   * Gets the current user's profile
   */
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Updates the current user's profile
   */
  async updateProfile(profileData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const updates = {
      ...profileData,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
