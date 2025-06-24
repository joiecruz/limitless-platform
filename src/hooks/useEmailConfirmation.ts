import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

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
  
  // Method 1: Check for token in hash parameters (Supabase default method)
  if (window.location.hash) {
    // Check for access_token in the hash (Supabase format)
    const tokenMatch = window.location.hash.match(/access_token=([^&]+)/);
    if (tokenMatch && tokenMatch[1]) {
      console.log("Found token in hash parameters");
      return tokenMatch[1];
    }
  }
  
  // Method 2: Check for token in query parameters (custom redirect handling)
  const queryParams = new URLSearchParams(window.location.search);
  const queryToken = queryParams.get('token');
    
  if (queryToken) {
    console.log("Found token in query parameters");
    return queryToken;
  }
  
  // Method 3: Check for token in URL path for direct password reset links
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
  
  // Method 4: Check URL for JWT-like string (last resort)
  const jwtPattern = /([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
  const fullUrl = window.location.href;
  const jwtMatch = fullUrl.match(jwtPattern);
  
  if (jwtMatch && jwtMatch[0]) {
    console.log("Found JWT-like token in URL");
    return jwtMatch[0];
  }
  
  console.log("No token found in URL");
  return null;
};

// Extract email from URL (for password reset)
export const extractEmailFromUrl = (): string | null => {
  // Check hash parameters
  let email = null;
  
  if (window.location.hash) {
    const emailMatch = window.location.hash.match(/email=([^&]+)/);
    if (emailMatch && emailMatch[1]) {
      email = decodeURIComponent(emailMatch[1]);
    }
  }
  
  // Check query parameters if not in hash
  if (!email) {
    const queryParams = new URLSearchParams(window.location.search);
    email = queryParams.get('email');
  }
  
  return email;
};
