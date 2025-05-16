
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEmailConfirmation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isEmailConfirmation = window.location.hash.includes('type=signup') || 
                             window.location.hash.includes('type=email_change') ||
                             new URLSearchParams(window.location.search).get('type') === 'signup';
                             
  const isPasswordReset = window.location.hash.includes('type=recovery') || 
                         window.location.pathname.includes('reset-password');

  return { isEmailConfirmation, isPasswordReset, isProcessing, setIsProcessing };
};

export const extractTokenFromUrl = () => {
  // Check for token in both hash and query parameters
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const queryParams = new URLSearchParams(window.location.search);
  
  // First check hash (Supabase default method)
  let accessToken = hashParams.get('access_token');
  
  // If not in hash, check query params (custom redirect handling)
  if (!accessToken) {
    accessToken = queryParams.get('token');
  }
  
  return accessToken;
};
