
// Simple utility to check if we're on the apex domain
// We want to redirect from limitlesslab.org to www.limitlesslab.org
export const isApexDomain = (): boolean => {
  // Cache the hostname 
  const hostname = window.location.hostname;
  
  // Is this limitlesslab.org without a subdomain?
  return hostname === 'limitlesslab.org' || hostname === 'limitlesslab.com';
};

// Check if we're on the app subdomain (app.limitlesslab.org)
export const isAppSubdomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.startsWith('app.') || 
         hostname === 'localhost' || 
         hostname.includes('netlify.app');
};

// Normalize domain for consistent usage
export const getNormalizedDomain = (): string => {
  const hostname = window.location.hostname;
  
  // Handle local development
  if (hostname === 'localhost' || hostname.includes('netlify.app')) {
    return hostname;
  }
  
  // Extract base domain
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  }
  
  return hostname;
};

// Public-facing origin for shareable links (QR codes, participant URLs).
// Always returns the custom domain in production-like environments so links
// shown to participants never expose preview/lovable.app URLs.
export const getPublicSiteOrigin = (): string => {
  if (typeof window === "undefined") return "https://www.limitlesslab.org";
  const hostname = window.location.hostname;
  // Use local origin only when developing locally
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return window.location.origin;
  }
  return "https://www.limitlesslab.org";
};

