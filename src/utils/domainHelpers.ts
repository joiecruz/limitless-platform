
import { WWW_URL, APP_URL, FORCE_WWW_REDIRECT } from '@/config/env';

/**
 * Checks if the current hostname is the apex domain (without www)
 * @returns {boolean} True if current hostname is the apex domain
 */
export function isApexDomain(): boolean {
  const hostname = window.location.hostname;
  
  // If we're in development mode, don't redirect
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return false;
  }

  // Extract domain without subdomain
  const domainRegex = /(?:.*\.)?([^.]+\.[^.]+)$/;
  const match = hostname.match(domainRegex);
  const domain = match ? match[1] : hostname;
  
  // Check if we're on the apex domain (without www)
  const isApex = hostname === domain;
  
  // Only consider it an apex domain if FORCE_WWW_REDIRECT is enabled
  return isApex && FORCE_WWW_REDIRECT;
}

/**
 * Checks if the current hostname is an app subdomain (app.domain.com)
 * @returns {boolean} True if current hostname is an app subdomain
 */
export function isAppSubdomain(): boolean {
  const hostname = window.location.hostname;
  
  // If we're in development mode, consider it as an app subdomain for testing
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return true;
  }

  // Check if the hostname starts with "app."
  return hostname.startsWith('app.');
}

/**
 * Gets the normalized domain name without subdomain
 * @returns {string} The normalized domain (e.g., domain.com)
 */
export function getNormalizedDomain(): string {
  const hostname = window.location.hostname;
  
  // If we're in development mode, return a placeholder
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return 'localhost';
  }

  // Extract domain without subdomain
  const domainRegex = /(?:.*\.)?([^.]+\.[^.]+)$/;
  const match = hostname.match(domainRegex);
  return match ? match[1] : hostname;
}

/**
 * Gets the base URL for the current environment
 * @returns {string} The base URL
 */
export function getBaseUrl(): string {
  // Return the APP_URL in production
  if (import.meta.env.PROD) {
    return APP_URL;
  }
  
  // In development, use the current window location
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * Gets the www URL for redirects
 * @returns {string} The www URL
 */
export function getWwwUrl(): string {
  return WWW_URL;
}
