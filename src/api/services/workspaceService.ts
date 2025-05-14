
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const workspaceService = {
  /**
   * Get all workspaces for the current user
   */
  async getUserWorkspaces() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get session to include in the request
    const { data: { session } } = await supabase.auth.getSession();
    const authHeader = session ? `Bearer ${session.access_token}` : '';

    // Call the edge function with authorization header
    return apiClient.invoke('get-user-workspaces', { 
      user_id: user.id,
      headers: {
        Authorization: authHeader
      }
    });
  },
  
  /**
   * Create a new workspace
   */
  async createWorkspace(data: { name: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const slug = this.generateSlug(data.name);
    
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert([{ name: data.name, slug }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Add creator as workspace owner
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert([{
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner'
      }]);
      
    if (memberError) throw memberError;
    
    return workspace;
  },
  
  /**
   * Update workspace
   */
  async updateWorkspace(workspaceId: string, data: { name: string }) {
    const newSlug = this.generateSlug(data.name);
    
    const { data: updatedWorkspace, error } = await supabase
      .from('workspaces')
      .update({
        name: data.name,
        slug: newSlug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workspaceId)
      .select()
      .single();
      
    if (error) throw error;
    return updatedWorkspace;
  },
  
  /**
   * Generate a slug from workspace name
   */
  generateSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseSlug}-${randomSuffix}`;
  },
  
  /**
   * Get workspace members
   */
  async getMembers(workspaceId: string) {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(`
        user_id,
        role,
        created_at,
        profiles!inner (
          first_name,
          last_name,
          email
        )
      `)
      .eq("workspace_id", workspaceId);

    if (error) throw error;
    return data;
  }
};
