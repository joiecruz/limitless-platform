import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { authConfig } from "./AuthConfig";

export function AuthForm() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={authConfig.appearance}
      theme="default"
      providers={[]}
      redirectTo={`${window.location.origin}/dashboard`}
      showLinks={false}
      localization={authConfig.localization}
    />
  );
}