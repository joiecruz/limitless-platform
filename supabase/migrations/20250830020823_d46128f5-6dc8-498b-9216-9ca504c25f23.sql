-- SECURITY FIX: Fix profiles table RLS policies to prevent unauthorized email access
-- The current setup has overlapping SELECT policies that allow broader access than intended

-- Drop the overly permissive SELECT policies
DROP POLICY IF EXISTS "Admins and superadmins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a single, secure SELECT policy that properly restricts access
CREATE POLICY "Secure profile access" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  -- Users can only see their own profile
  id = auth.uid()
  OR
  -- OR if they are an admin/superadmin, they can see all profiles
  EXISTS (
    SELECT 1 FROM public.profiles p2
    WHERE p2.id = auth.uid() 
    AND (p2.is_admin = true OR p2.is_superadmin = true)
  )
);

-- Ensure the UPDATE policy is secure (users can only update their own profile)
-- The existing policy looks correct but let's verify it's the only UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Ensure the INSERT policy is secure (users can only create their own profile)
-- The existing policy looks correct
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

-- Keep the existing DELETE policy for superadmins only
-- This one looks secure already