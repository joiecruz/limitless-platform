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

-- Create a view for public course enrollment counts to maintain functionality
-- This allows public access to counts without exposing user data
CREATE OR REPLACE VIEW public.course_enrollment_counts AS
SELECT 
  course_id,
  COUNT(*) as enrollment_count
FROM enrollments
GROUP BY course_id;

-- Create a security definer function for getting enrollment counts publicly
CREATE OR REPLACE FUNCTION public.get_course_enrollment_count(course_id_param uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT COUNT(*)::integer FROM enrollments WHERE course_id = course_id_param), 
    0
  );
$$;