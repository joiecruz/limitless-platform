-- Add INSERT policy for lessons (admin only)
CREATE POLICY "Admins can insert lessons" 
ON public.lessons 
FOR INSERT 
TO authenticated
WITH CHECK (is_current_user_superadmin_safe());

-- Add UPDATE policy for lessons (admin only)
CREATE POLICY "Admins can update lessons" 
ON public.lessons 
FOR UPDATE 
TO authenticated
USING (is_current_user_superadmin_safe())
WITH CHECK (is_current_user_superadmin_safe());

-- Add DELETE policy for lessons (admin only)
CREATE POLICY "Admins can delete lessons" 
ON public.lessons 
FOR DELETE 
TO authenticated
USING (is_current_user_superadmin_safe());