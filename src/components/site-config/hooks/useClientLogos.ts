import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "../types/logo";

export function useClientLogos() {
  return useQuery({
    queryKey: ['client-logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_logos')
        .select('id, name, image_url')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        
        throw error;
      }

      return data as Logo[];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes (formerly cacheTime)
  });
}