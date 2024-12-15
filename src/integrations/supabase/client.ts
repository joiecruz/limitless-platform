import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Default to production values
let supabaseUrl = "https://crllgygjuqpluvdpwayi.supabase.co";
let supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

// Check if we're in staging
if (window.location.hostname.includes('staging')) {
  supabaseUrl = "YOUR_STAGING_SUPABASE_URL";
  supabaseKey = "YOUR_STAGING_SUPABASE_ANON_KEY";
  console.log('Using staging Supabase configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

// Add session refresh on page load
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('pendingWorkspaceJoin');
  }
});