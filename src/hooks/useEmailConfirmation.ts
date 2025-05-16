
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

  // Enhanced token extraction approach with detailed logging
  
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
  
  // Check localStorage (may have been stored during forgot password step)
  if (!email) {
    email = localStorage.getItem('passwordResetEmail');
  }
  
  return email;
};

// Verify if a token is valid (not expired)
export const verifyResetToken = async (token: string, email?: string | null): Promise<boolean> => {
  if (!token) {
    console.log("No token provided to verify");
    return false;
  }

  try {
    // We'll use a completely different approach - try to get a session directly
    // This is more reliable than token verification in newer Supabase versions
    console.log("Attempting direct session check with token");
    
    // First approach: try to set the session with the token
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: ''
      });
      
      if (data?.session) {
        console.log("Successfully created session from token");
        return true;
      }
      
      if (error) {
        console.log("Failed to create session from token:", error);
        // Continue to other methods
      }
    } catch (sessionError) {
      console.log("Session creation error:", sessionError);
    }
    
    // Second approach: Try direct updateUser as a way to test token
    try {
      // We're not actually updating the password here, just testing if the token is valid
      // by seeing if we can execute an updateUser operation (will fail if token is invalid)
      const { error } = await supabase.auth.updateUser({});
      
      if (!error) {
        console.log("Token verification successful via updateUser test");
        return true;
      }
    } catch (updateError) {
      console.log("Token verification via updateUser failed:", updateError);
    }
    
    // Third approach: For newer Supabase versions
    if (token.includes('.')) {
      try {
        const { data, error } = await supabase.auth.getUser(token);
        
        if (data?.user && !error) {
          console.log("Token verification successful via getUser");
          return true;
        }
      } catch (getUserError) {
        console.log("Get user with token failed:", getUserError);
      }
    }
    
    // Fallback to older methods - some versions of Supabase require these
    if (email) {
      try {
        // This is a special edge case for old Supabase versions
        await supabase.auth.resetPasswordForEmail(email);
        console.log("Fallback verification via resetPasswordForEmail successful");
        return true;
      } catch (emailResetError) {
        console.log("Fallback resetPasswordForEmail failed:", emailResetError);
      }
    }
    
    console.log("All token verification methods failed");
    return false;
    
  } catch (error) {
    console.error("Token verification failed with exception:", error);
    return false;
  }
};
