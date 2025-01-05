import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const checkUserProfile = async (session: Session | null) => {
  if (!session?.user.id) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, role, company_size, goals, referral_source')
    .eq('id', session.user.id)
    .single();

  const needsOnboarding = !profile?.first_name || 
                         !profile?.last_name || 
                         !profile?.role || 
                         !profile?.company_size || 
                         !profile?.goals || 
                         !profile?.referral_source;

  return needsOnboarding;
};