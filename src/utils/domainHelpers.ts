
/**
 * Helper functions for dealing with multiple domains
 */

/**
 * Normalizes the domain for consistent storage access
 * Ensures authentication works across www.limitlesslab.org, limitlesslab.org, and app.limitlesslab.org
 */
export const getNormalizedDomain = (): string => {
  const hostname = window.location.hostname;
  
  // If in development environment
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return 'localhost';
  }
  
  // Extract root domain from various subdomains
  if (hostname.includes('limitlesslab.org')) {
    return 'limitlesslab.org';
  }
  
  // For preview domains like Lovable app domain
  return hostname;
};

/**
 * Gets domain-specific localStorage key to avoid conflicts
 */
export const getDomainStorageKey = (key: string): string => {
  const normalizedDomain = getNormalizedDomain();
  return `${normalizedDomain}:${key}`;
};

/**
 * Checks if the current page is loaded from main domain or app subdomain
 */
export const isAppSubdomain = (): boolean => {
  return window.location.hostname.startsWith('app.');
};

/**
 * Checks if we're on the apex domain without www
 */
export const isApexDomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === 'limitlesslab.org' && !hostname.startsWith('www.');
};
