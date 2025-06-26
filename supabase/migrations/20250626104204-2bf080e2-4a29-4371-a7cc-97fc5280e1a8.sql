
-- Check if master_trainer_access table exists and create policies if needed
-- Enable RLS on master_trainer_access table
ALTER TABLE public.master_trainer_access ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own master trainer access
CREATE POLICY "Users can view their own master trainer access" 
  ON public.master_trainer_access 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for superadmins to view all master trainer access
CREATE POLICY "Superadmins can view all master trainer access" 
  ON public.master_trainer_access 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_superadmin = true
    )
  );

-- Enable RLS on master trainer materials, profiles, recordings, and FAQs
ALTER TABLE public.master_trainer_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_faqs ENABLE ROW LEVEL SECURITY;

-- Policies for master trainer materials (read-only for authorized users)
CREATE POLICY "Master trainers and superadmins can view materials" 
  ON public.master_trainer_materials 
  FOR SELECT 
  USING (
    -- User is superadmin
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_superadmin = true
    )
    OR
    -- User has master trainer access
    EXISTS (
      SELECT 1 FROM public.master_trainer_access 
      WHERE master_trainer_access.user_id = auth.uid()
    )
  );

-- Policies for master trainer profiles (read-only for authorized users)
CREATE POLICY "Master trainers and superadmins can view trainer profiles" 
  ON public.master_trainer_profiles 
  FOR SELECT 
  USING (
    -- User is superadmin
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_superadmin = true
    )
    OR
    -- User has master trainer access
    EXISTS (
      SELECT 1 FROM public.master_trainer_access 
      WHERE master_trainer_access.user_id = auth.uid()
    )
  );

-- Policies for master trainer recordings (read-only for authorized users)
CREATE POLICY "Master trainers and superadmins can view recordings" 
  ON public.master_trainer_recordings 
  FOR SELECT 
  USING (
    -- User is superadmin
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_superadmin = true
    )
    OR
    -- User has master trainer access
    EXISTS (
      SELECT 1 FROM public.master_trainer_access 
      WHERE master_trainer_access.user_id = auth.uid()
    )
  );

-- Policies for master trainer FAQs (read-only for authorized users)
CREATE POLICY "Master trainers and superadmins can view FAQs" 
  ON public.master_trainer_faqs 
  FOR SELECT 
  USING (
    -- User is superadmin
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_superadmin = true
    )
    OR
    -- User has master trainer access
    EXISTS (
      SELECT 1 FROM public.master_trainer_access 
      WHERE master_trainer_access.user_id = auth.uid()
    )
  );
