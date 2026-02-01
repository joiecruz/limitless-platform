-- Fix RLS policies for course invite flow

-- 1. Fix pending_course_enrollments SELECT policy to allow authenticated users to view by email directly
DROP POLICY IF EXISTS "Users can view their own pending enrollment" ON pending_course_enrollments;

CREATE POLICY "Users can view pending enrollments by their email"
ON pending_course_enrollments FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    -- Allow if email matches their profile
    email = (SELECT p.email FROM profiles p WHERE p.id = auth.uid())
    -- Or allow if they are authenticated and email matches (for new signups before profile exists)
    OR email = auth.jwt() ->> 'email'
  )
);

-- 2. Fix user_course_access INSERT policy to allow users to insert their own records
CREATE POLICY "Users can insert their own course access"
ON user_course_access FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Also need UPDATE policy on pending_course_enrollments for marking as processed
DROP POLICY IF EXISTS "Admins can update pending enrollments" ON pending_course_enrollments;

CREATE POLICY "Users or admins can update pending enrollments"
ON pending_course_enrollments FOR UPDATE
USING (
  is_current_user_admin_or_superadmin()
  OR email = (SELECT p.email FROM profiles p WHERE p.id = auth.uid())
  OR email = auth.jwt() ->> 'email'
);