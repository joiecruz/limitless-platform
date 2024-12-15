import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crllgygjuqpluvdpwayi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI2NjQzNzAsImV4cCI6MjAxODI0MDM3MH0.qgkN_0vO8cupvAYkl7J-0I4UuPj0xfXbwKD0Ue1Rx-c';

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