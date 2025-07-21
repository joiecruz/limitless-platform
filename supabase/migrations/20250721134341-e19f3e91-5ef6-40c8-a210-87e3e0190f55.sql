-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins and superadmins can view all profiles" ON public.profiles;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin_or_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.is_admin = true OR profiles.is_superadmin = true)
  );
$$;

-- Create a new policy using the security definer function
CREATE POLICY "Admins and superadmins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Users can view their own profile OR they are admin/superadmin
  (id = auth.uid()) OR is_current_user_admin_or_superadmin()
);