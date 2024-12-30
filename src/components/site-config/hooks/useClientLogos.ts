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

      console.log('Fetched logos:', data); // Add this to debug
      return data as Logo[];
    },
  });
}