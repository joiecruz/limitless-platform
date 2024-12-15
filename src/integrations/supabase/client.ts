import { createClient } from '@supabase/supabase-js';

// Get environment-specific Supabase URL and key
const getSupabaseConfig = () => {
  // Development environment (local)
  if (process.env.NODE_ENV === 'development') {
    return {
      url: 'https://crllgygjuqpluvdpwayi.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI2NjQzNzAsImV4cCI6MjAxODI0MDM3MH0.qgkN_0vO8cupvAYkl7J-0I4UuPj0xfXbwKD0Ue1Rx-c'
    };
  }

  // Production and staging environments
  return {
    url: window.__SUPABASE_URL__,
    key: window.__SUPABASE_ANON_KEY__
  };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Make sure environment variables are set correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  }
});

// Add session refresh on page load
let refreshing = false;
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', { event, session, timestamp: new Date().toISOString() });
  
  if (event === 'SIGNED_OUT') {
    console.log('User signed out - Clearing session and cache');
    localStorage.removeItem('pendingWorkspaceJoin');
    localStorage.removeItem('supabase.auth.token');
  }
  
  // Attempt to refresh token if session exists but token might be expired
  if (session && !refreshing) {
    refreshing = true;
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        // Force sign out if refresh fails
        await supabase.auth.signOut();
      } else {
        console.log('Session refreshed successfully:', data);
      }
    } catch (error) {
      console.error('Error during session refresh:', error);
    } finally {
      refreshing = false;
    }
  }
});