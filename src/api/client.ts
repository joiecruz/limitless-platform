
import { supabase } from "@/integrations/supabase/client";

/**
 * Base API client that wraps Supabase calls
 * This provides a central place to handle API errors and responses
 */
class ApiClient {
  async get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .select(params?.select || '*')
        .eq(params?.filterColumn || '', params?.filterValue || '')
        .order(params?.orderColumn || 'created_at', { 
          ascending: params?.ascending || false 
        });

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`API GET Error (${endpoint}):`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, payload: any): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`API POST Error (${endpoint}):`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, id: string, payload: any): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`API PUT Error (${endpoint}):`, error);
      throw error;
    }
  }

  async delete(endpoint: string, id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(endpoint)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`API DELETE Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Function invoker for edge functions
  async invoke<T>(functionName: string, payload?: any): Promise<T> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`API Function Error (${functionName}):`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
