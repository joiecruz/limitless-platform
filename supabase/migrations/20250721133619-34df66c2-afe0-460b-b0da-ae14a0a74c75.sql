-- Add RLS policy to allow admins and superadmins to read all profiles
CREATE POLICY "Admins and superadmins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND (profiles.is_admin = true OR profiles.is_superadmin = true)
));