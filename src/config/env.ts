
// Environment variables configuration

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://crllgygjuqpluvdpwayi.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

// Application URLs
export const APP_URL = import.meta.env.VITE_APP_URL || "https://limitlesslab.org";
export const WWW_URL = import.meta.env.VITE_WWW_URL || "https://www.limitlesslab.org";

// Storage bucket names
export const BLOG_COVERS_BUCKET = "blog-covers";
export const BLOG_ASSETS_BUCKET = "blog-assets";

// Function to determine if we should force www redirect
export const FORCE_WWW_REDIRECT = import.meta.env.VITE_FORCE_WWW_REDIRECT === "true";
