import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    __SUPABASE_URL__: string;
    __SUPABASE_ANON_KEY__: string;
  }
}

const supabaseUrl = typeof __SUPABASE_URL__ !== 'undefined' ? __SUPABASE_URL__ : '';
const supabaseAnonKey = typeof __SUPABASE_ANON_KEY__ !== 'undefined' ? __SUPABASE_ANON_KEY__ : '';

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