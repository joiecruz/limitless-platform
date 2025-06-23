import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSessionValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const checkSession = useCallback(async () => {
    // Skip session check for public routes
    const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/'];
    if (publicRoutes.includes(location.pathname)) {
      return true;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        // Clear any stale auth data
        await supabase.auth.signOut();

        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });

        navigate('/signin');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      navigate('/signin');
      return false;
    }
  }, [navigate, location.pathname, toast]);

  // Check session on mount and when location changes
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Check session on any click
  useEffect(() => {
    const handleClick = () => {
      checkSession();
    };

    // Add global click listener
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [checkSession]);

  // Also check session on visibility change (when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkSession]);

  return { checkSession };
};