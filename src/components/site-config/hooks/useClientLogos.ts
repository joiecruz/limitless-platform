import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "../types/logo";

export function useClientLogos() {
  return useQuery({
    queryKey: ['client-logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching logos:', error);
        throw error;
      }

      return data as Logo[];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes (formerly cacheTime)
  });
}