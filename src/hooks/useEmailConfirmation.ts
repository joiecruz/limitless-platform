import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEmailConfirmation = () => {
  const isEmailConfirmation = window.location.hash.includes('type=signup') || 
                             window.location.hash.includes('type=email_change') ||
                             new URLSearchParams(window.location.search).get('type') === 'signup';

  return { isEmailConfirmation };
};