-- ==========================================
-- SECURITY FIX: Create Separate User Roles Table
-- ==========================================
-- This migration addresses privilege escalation risks by moving
-- role management from the profiles table to a dedicated user_roles table

-- 1. Create enum for application roles
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'moderator', 'user');

-- 2. Create the user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check if user has a specific role
-- This function bypasses RLS to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 5. Create function to check if current user has a specific role
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), _role);
$$;

-- 6. Create function to check if current user is superadmin (replacement for is_current_user_superadmin_safe)
CREATE OR REPLACE FUNCTION public.is_current_user_superadmin_v2()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'superadmin');
$$;

-- 7. Create function to check if current user is admin or superadmin
CREATE OR REPLACE FUNCTION public.is_current_user_admin_or_superadmin_v2()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
  );
$$;

-- 8. Migrate existing roles from profiles table to user_roles table
INSERT INTO public.user_roles (user_id, role, granted_at)
SELECT id, 'superadmin'::public.app_role, created_at
FROM public.profiles
WHERE is_superadmin = true
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, granted_at)
SELECT id, 'admin'::public.app_role, created_at
FROM public.profiles
WHERE is_admin = true AND is_superadmin = false
ON CONFLICT (user_id, role) DO NOTHING;

-- 9. Create RLS policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Superadmins can view all roles
CREATE POLICY "Superadmins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Only superadmins can manage roles
CREATE POLICY "Superadmins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'))
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- 10. Add index for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- 11. Create helper function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_highest_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'superadmin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'moderator' THEN 3
      WHEN 'user' THEN 4
    END
  LIMIT 1;
$$;

COMMENT ON TABLE public.user_roles IS 'Stores user roles in a dedicated table to prevent privilege escalation attacks';
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check if a user has a specific role, bypassing RLS';
COMMENT ON FUNCTION public.current_user_has_role IS 'Check if the current authenticated user has a specific role';
COMMENT ON FUNCTION public.is_current_user_superadmin_v2 IS 'Replacement for is_current_user_superadmin_safe using new roles table';
COMMENT ON FUNCTION public.is_current_user_admin_or_superadmin_v2 IS 'Replacement for is_current_user_admin_or_superadmin using new roles table';