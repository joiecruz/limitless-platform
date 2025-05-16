
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
    search: window.location.search
  });

  // Try multiple methods to find the token
  
  // Method 1: Check for token in hash parameters (Supabase default method)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  let accessToken = hashParams.get('access_token');
  
  // Method 2: Check for token in query parameters (custom redirect handling)
  if (!accessToken) {
    const queryParams = new URLSearchParams(window.location.search);
    accessToken = queryParams.get('token');
  }
  
  // Method 3: Check for specific hash format with key=value pairs but without '?'
  if (!accessToken && window.location.hash) {
    const hashParts = window.location.hash.substring(1).split('&');
    for (const part of hashParts) {
      if (part.startsWith('access_token=')) {
        accessToken = part.split('=')[1];
        break;
      }
    }
  }
  
  // Method 4: Check URL for JWT-like string (last resort)
  if (!accessToken) {
    const jwtPattern = /([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
    const fullUrl = window.location.href;
    const jwtMatch = fullUrl.match(jwtPattern);
    
    if (jwtMatch && jwtMatch[0]) {
      accessToken = jwtMatch[0];
    }
  }
  
  console.log("Extracted token:", accessToken ? "Found token" : "No token found");
  return accessToken;
};
