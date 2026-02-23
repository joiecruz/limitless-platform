
-- Add missing INSERT policy and superadmin SELECT policy for sessions

DO $$
BEGIN
  -- Only create if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Users can insert their own sessions') THEN
    CREATE POLICY "Users can insert their own sessions"
    ON public.sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Superadmins can view all sessions') THEN
    CREATE POLICY "Superadmins can view all sessions"
    ON public.sessions FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_superadmin = true
    ));
  END IF;
END $$;
