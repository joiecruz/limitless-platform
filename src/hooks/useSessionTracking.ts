import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSessionTracking() {
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    const startSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const now = new Date();
      startTimeRef.current = now;

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: session.user.id,
          started_at: now.toISOString(),
        })
        .select('id')
        .single();

      if (!error && data) {
        sessionIdRef.current = data.id;
      }
    };

    const endSession = async () => {
      if (!sessionIdRef.current || !startTimeRef.current) return;

      const now = new Date();
      const durationMinutes = Math.round(
        (now.getTime() - startTimeRef.current.getTime()) / 60000
      );

      await supabase
        .from('sessions')
        .update({
          ended_at: now.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq('id', sessionIdRef.current);

      sessionIdRef.current = null;
      startTimeRef.current = null;
    };

    startSession();

    // End session on page unload
    const handleBeforeUnload = () => {
      if (sessionIdRef.current && startTimeRef.current) {
        const now = new Date();
        const durationMinutes = Math.round(
          (now.getTime() - startTimeRef.current.getTime()) / 60000
        );
        // Use sendBeacon for reliable unload tracking
        const url = `${import.meta.env.VITE_SUPABASE_URL || 'https://bqsvbdariidfrhmzxghr.supabase.co'}/rest/v1/sessions?id=eq.${sessionIdRef.current}`;
        navigator.sendBeacon(url); // Best-effort; update may not go through
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen for auth changes to end/start sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        endSession();
      } else if (event === 'SIGNED_IN') {
        startSession();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      subscription.unsubscribe();
      endSession();
    };
  }, []);
}
