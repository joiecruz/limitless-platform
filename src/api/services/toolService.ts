
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const toolService = {
  /**
   * Get all tools
   */
  async getAllTools() {
    const { data, error } = await supabase
      .from('innovation_tools')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get a single tool by ID
   */
  async getToolById(id: string) {
    const { data, error } = await supabase
      .from("innovation_tools")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
  
  /**
   * Track tool download
   */
  async trackDownload(id: string) {
    const { data: tool } = await this.getToolById(id);
    
    const { error } = await supabase
      .from("innovation_tools")
      .update({ downloads_count: (tool.downloads_count || 0) + 1 })
      .eq("id", id);

    if (error) throw error;
  }
};
