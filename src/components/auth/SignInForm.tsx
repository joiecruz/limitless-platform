import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function SignInForm() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#393ca0',
              brandAccent: '#2d2f80',
              brandButtonText: 'white',
              defaultButtonBackground: 'white',
              defaultButtonBackgroundHover: '#f9fafb',
              inputBackground: 'white',
              inputBorder: '#e5e7eb',
              inputBorderHover: '#393ca0',
              inputBorderFocus: '#393ca0',
            },
            borderWidths: {
              buttonBorderWidth: '1px',
              inputBorderWidth: '1px',
            },
            radii: {
              borderRadiusButton: '0.5rem',
              buttonBorderRadius: '0.5rem',
              inputBorderRadius: '0.5rem',
            },
          },
        },
        style: {
          button: {
            height: '2.75rem',
            borderRadius: '0.5rem',
          },
          input: {
            height: '2.75rem',
            borderRadius: '0.5rem',
          },
          anchor: {
            color: '#393ca0',
            textDecoration: 'none',
          },
          message: {
            color: '#ef4444',
          },
          divider: {
            background: '#e5e7eb',
          },
        },
      }}
      theme="default"
      providers={[]}
      redirectTo={window.location.origin + "/dashboard"}
      showLinks={false}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign in',
            loading_button_label: 'Signing in...',
            social_provider_text: 'Sign in with {{provider}}',
            link_text: 'Already have an account? Sign in',
          },
          sign_up: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign up',
            loading_button_label: 'Signing up...',
            social_provider_text: 'Sign up with {{provider}}',
            link_text: "Don't have an account? Sign up",
          },
        },
      }}
    />
  );
}