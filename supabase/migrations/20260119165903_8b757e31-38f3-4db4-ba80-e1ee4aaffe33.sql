-- Drop existing policies for training_reports
DROP POLICY IF EXISTS "Users can view their own training reports" ON public.training_reports;
DROP POLICY IF EXISTS "Superadmins can view all training reports" ON public.training_reports;
DROP POLICY IF EXISTS "Users can create their own training reports" ON public.training_reports;
DROP POLICY IF EXISTS "Users can update their own training reports" ON public.training_reports;
DROP POLICY IF EXISTS "Superadmins can manage all training reports" ON public.training_reports;

-- Create improved policies for training_reports (authenticated only)
CREATE POLICY "Users can view their own training reports" 
ON public.training_reports 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can view all training reports" 
ON public.training_reports 
FOR SELECT 
TO authenticated
USING (is_current_user_superadmin_safe());

CREATE POLICY "Users can create their own training reports" 
ON public.training_reports 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training reports" 
ON public.training_reports 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Superadmins can update all training reports" 
ON public.training_reports 
FOR UPDATE 
TO authenticated
USING (is_current_user_superadmin_safe());

CREATE POLICY "Users can delete their own training reports" 
ON public.training_reports 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can delete all training reports" 
ON public.training_reports 
FOR DELETE 
TO authenticated
USING (is_current_user_superadmin_safe());

-- Drop existing policies for training_session_reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.training_session_reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.training_session_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.training_session_reports;
DROP POLICY IF EXISTS "Superadmins can manage all reports" ON public.training_session_reports;

-- Create improved policies for training_session_reports (authenticated only)
CREATE POLICY "Users can view their own session reports" 
ON public.training_session_reports 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can view all session reports" 
ON public.training_session_reports 
FOR SELECT 
TO authenticated
USING (is_current_user_superadmin_safe());

CREATE POLICY "Users can create their own session reports" 
ON public.training_session_reports 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session reports" 
ON public.training_session_reports 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Superadmins can update all session reports" 
ON public.training_session_reports 
FOR UPDATE 
TO authenticated
USING (is_current_user_superadmin_safe());

CREATE POLICY "Users can delete their own session reports" 
ON public.training_session_reports 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can delete all session reports" 
ON public.training_session_reports 
FOR DELETE 
TO authenticated
USING (is_current_user_superadmin_safe());