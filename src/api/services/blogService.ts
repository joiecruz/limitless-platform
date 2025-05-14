
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const blogService = {
  /**
   * Get all published blog posts
   */
  async getPublishedPosts() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get a single blog post by slug
   */
  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get admin blog posts
   */
  async getAdminPosts() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Create a new blog post
   */
  async createPost(data: any) {
    const createdAt = data.created_at || new Date().toISOString();
    
    const { data: post, error } = await supabase
      .from('articles')
      .insert([{
        ...data,
        created_at: createdAt,
      }]);
    
    if (error) throw error;
    return post;
  },
  
  /**
   * Update a blog post
   */
  async updatePost(id: string, data: any) {
    const { error } = await supabase
      .from('articles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  },
  
  /**
   * Delete a blog post
   */
  async deletePost(id: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  /**
   * Toggle publish status
   */
  async togglePublish(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('articles')
      .update({ published: !currentStatus })
      .eq('id', id);
    
    if (error) throw error;
    return { published: !currentStatus };
  },
  
  /**
   * Get related blog posts
   */
  async getRelatedPosts(currentPostId: string, categories: string[], tags: string[]) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .neq('id', currentPostId)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    return data;
  }
};
