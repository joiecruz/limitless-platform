-- Add policy for admins to manage all course access (covers insert/delete operations for admins)
CREATE POLICY "Admins can manage all course access"
ON public.user_course_access
FOR ALL
USING (public.is_current_user_admin_or_superadmin())
WITH CHECK (public.is_current_user_admin_or_superadmin());