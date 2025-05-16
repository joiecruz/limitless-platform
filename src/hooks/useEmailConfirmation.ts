
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEmailConfirmation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check for different confirmation types
  const isEmailConfirmation = window.location.hash.includes('type=signup') || 
                             window.location.hash.includes('type=email_change') ||
                             new URLSearchParams(window.location.search).get('type') === 'signup';
                             
  const isPasswordReset = window.location.hash.includes('type=recovery') || 
                         new URLSearchParams(window.location.search).get('type') === 'recovery' ||
                         window.location.pathname.includes('reset-password');

  return { isEmailConfirmation, isPasswordReset, isProcessing, setIsProcessing };
};

export const extractTokenFromUrl = (): string | null => {
  console.log("Extracting token from URL:", {
    hash: window.location.hash,
    search: window.location.search,
    pathname: window.location.pathname
  });

  // Enhanced token extraction approach with detailed logging
  
  // Method 1: Check for token in hash parameters (Supabase default method)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  let accessToken = hashParams.get('access_token');
  
  if (accessToken) {
    console.log("Found token in hash parameters");
    return accessToken;
  }
  
  // Method 2: Check for token in query parameters (custom redirect handling)
  const queryParams = new URLSearchParams(window.location.search);
  accessToken = queryParams.get('token');
    
  if (accessToken) {
    console.log("Found token in query parameters");
    return accessToken;
  }
  
  // Method 3: Check for specific hash format with key=value pairs but without '?'
  if (window.location.hash) {
    const hashParts = window.location.hash.substring(1).split('&');
    for (const part of hashParts) {
      if (part.startsWith('access_token=')) {
        accessToken = part.split('=')[1];
        console.log("Found token in raw hash string");
        return accessToken;
      }
    }
  }
  
  // Method 4: Check for token in URL path for direct password reset links
  // Example: /reset-password/TOKEN
  if (window.location.pathname.includes('/reset-password/')) {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 2) {
      const possibleToken = pathParts[pathParts.length - 1];
      // Basic validation: token should be at least 10 chars
      if (possibleToken && possibleToken.length > 10) {
        console.log("Found token in URL path");
        return possibleToken;
      }
    }
  }
  
  // Method 5: Check URL for JWT-like string (last resort)
  const jwtPattern = /([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
  const fullUrl = window.location.href;
  const jwtMatch = fullUrl.match(jwtPattern);
  
  if (jwtMatch && jwtMatch[0]) {
    console.log("Found JWT-like token in URL");
    return jwtMatch[0];
  }
  
  console.log("Extracted token:", accessToken ? "Found token" : "No token found");
  if (accessToken) {
    console.log("Token (first 10 chars):", accessToken.substring(0, 10) + "...");
  }
  
  return accessToken;
};

// Extract email from URL (for password reset)
export const extractEmailFromUrl = (): string | null => {
  // Check hash parameters
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  let email = hashParams.get('email');
  
  // Check query parameters if not in hash
  if (!email) {
    const queryParams = new URLSearchParams(window.location.search);
    email = queryParams.get('email');
  }
  
  // Check localStorage (may have been stored during forgot password step)
  if (!email) {
    email = localStorage.getItem('passwordResetEmail');
  }
  
  return email;
};
