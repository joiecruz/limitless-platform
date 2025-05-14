
// Environment configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://crllgygjuqpluvdpwayi.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8';

// App URLs
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://limitlesslab.org';
export const DASHBOARD_URL = `${APP_URL}/dashboard`;
export const ADMIN_URL = `${APP_URL}/admin`;

// Domain configuration
export const WWW_URL = import.meta.env.VITE_WWW_URL || 'https://www.limitlesslab.org';
export const FORCE_WWW_REDIRECT = import.meta.env.VITE_FORCE_WWW_REDIRECT === 'true';

// Blog storage bucket names
export const BLOG_COVERS_BUCKET = 'blog-covers';
export const BLOG_ASSETS_BUCKET = 'blog-assets';

// File upload limits (in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Flag for development environment
export const IS_DEVELOPMENT = import.meta.env.DEV || false;

// Auth redirect URLs
export const AUTH_REDIRECT_URL = `${DASHBOARD_URL}`;
export const RESET_PASSWORD_REDIRECT_URL = `${APP_URL}/reset-password`;
