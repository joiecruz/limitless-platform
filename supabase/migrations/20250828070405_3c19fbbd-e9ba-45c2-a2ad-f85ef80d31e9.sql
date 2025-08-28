-- CRITICAL SECURITY FIX: Remove public read access to secrets table
-- This fixes the vulnerability where anyone could read sensitive configuration data

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Anyone can read secrets" ON public.secrets;

-- Create secure policies for secrets table
-- Only superadmins can view secrets
CREATE POLICY "Only superadmins can read secrets" ON public.secrets
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_superadmin = true
  )
);

-- Only superadmins can insert secrets
CREATE POLICY "Only superadmins can insert secrets" ON public.secrets
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_superadmin = true
  )
);

-- Only superadmins can update secrets
CREATE POLICY "Only superadmins can update secrets" ON public.secrets
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_superadmin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_superadmin = true
  )
);

-- Only superadmins can delete secrets
CREATE POLICY "Only superadmins can delete secrets" ON public.secrets
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_superadmin = true
  )
);