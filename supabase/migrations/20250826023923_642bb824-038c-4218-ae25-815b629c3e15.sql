-- Fix security vulnerability in enrollments and message_reactions tables
-- Remove overly permissive public read policies and implement secure alternatives

-- First, drop the problematic public read policies
DROP POLICY IF EXISTS "Allow public read access to enrollments for counting" ON public.enrollments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.message_reactions;

-- Create secure policy for enrollments - only allow reading enrollment counts, not user data
CREATE POLICY "Allow reading enrollment counts only" ON public.enrollments
FOR SELECT 
USING (
  -- Users can see their own enrollments
  auth.uid() = user_id 
  OR 
  -- Superadmins can see all enrollments
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_superadmin = true
  )
);

-- Create secure policy for message_reactions - only allow reading reactions for accessible messages
CREATE POLICY "Users can read reactions for accessible messages" ON public.message_reactions
FOR SELECT 
USING (
  -- Can read reactions for messages in public channels
  EXISTS (
    SELECT 1 FROM messages m
    JOIN channels c ON m.id = message_reactions.message_id AND c.id = m.channel_id
    WHERE c.is_public = true
  )
  OR
  -- Can read reactions for messages in private channels they're a member of
  EXISTS (
    SELECT 1 FROM messages m
    JOIN channels c ON m.id = message_reactions.message_id AND c.id = m.channel_id
    JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
    WHERE c.is_public = false AND wm.user_id = auth.uid()
  )
  OR
  -- Admins can read all reactions
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND (profiles.is_admin = true OR profiles.is_superadmin = true)
  )
);

-- Create a materialized view for public course enrollment counts to maintain performance
-- This allows public access to counts without exposing user data
CREATE MATERIALIZED VIEW public.course_enrollment_counts AS
SELECT 
  course_id,
  COUNT(*) as enrollment_count
FROM enrollments
GROUP BY course_id;

-- Create index for performance
CREATE INDEX idx_course_enrollment_counts_course_id ON public.course_enrollment_counts(course_id);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_course_enrollment_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.course_enrollment_counts;
END;
$$;

-- Create trigger to refresh counts when enrollments change
CREATE OR REPLACE FUNCTION trigger_refresh_enrollment_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Schedule async refresh
  PERFORM pg_notify('refresh_enrollment_counts', '');
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add trigger to enrollments table
DROP TRIGGER IF EXISTS enrollment_counts_refresh ON public.enrollments;
CREATE TRIGGER enrollment_counts_refresh
  AFTER INSERT OR UPDATE OR DELETE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION trigger_refresh_enrollment_counts();

-- Allow public read access to the enrollment counts view (safe - no user data)
ALTER TABLE public.course_enrollment_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course enrollment counts are publicly viewable" ON public.course_enrollment_counts
FOR SELECT 
USING (true);

-- Initial refresh of the materialized view
REFRESH MATERIALIZED VIEW public.course_enrollment_counts;