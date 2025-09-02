-- CRITICAL FIX: Fix infinite recursion in profiles table policies
-- This is causing the "infinite recursion detected in policy for relation 'profiles'" error

-- First, check for and fix any recursive policies on profiles table
-- The issue is likely a policy that references the same table it's applied to

-- Drop all potentially problematic policies on profiles
DROP POLICY IF EXISTS "Secure profile access" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can delete users" ON public.profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Create a security definer function to check superadmin status without recursion
CREATE OR REPLACE FUNCTION public.is_current_user_superadmin_safe()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(is_superadmin, false) 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Allow superadmins to view and manage all profiles using the safe function
CREATE POLICY "Superadmins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() = id 
  OR public.is_current_user_superadmin_safe()
);

CREATE POLICY "Superadmins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (public.is_current_user_superadmin_safe());

CREATE POLICY "Superadmins can delete profiles" 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (public.is_current_user_superadmin_safe());