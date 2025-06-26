
-- Create tables for Master Trainers module

-- Table for managing access to the Master Trainers module (superadmin only for now)
CREATE TABLE public.master_trainer_access (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  granted_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- Table for trainer profiles in the directory
CREATE TABLE public.master_trainer_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  bio text,
  expertise_areas text[],
  contact_info jsonb DEFAULT '{}'::jsonb,
  profile_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- Table for exclusive toolkit materials
CREATE TABLE public.master_trainer_materials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  uploaded_by uuid REFERENCES auth.users NOT NULL,
  download_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table for Zoom recordings and LMS content
CREATE TABLE public.master_trainer_recordings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  duration integer, -- in seconds
  category text NOT NULL DEFAULT 'Training',
  thumbnail_url text,
  uploaded_by uuid REFERENCES auth.users NOT NULL,
  view_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table for FAQs
CREATE TABLE public.master_trainer_faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.master_trainer_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_trainer_faqs ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if current user is a superadmin
CREATE OR REPLACE FUNCTION public.is_current_user_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_superadmin = true
  );
$$;

-- Create secure RLS policies that require authentication AND superadmin status
CREATE POLICY "Authenticated superadmins can manage master trainer access" 
  ON public.master_trainer_access 
  FOR ALL 
  TO authenticated
  USING (public.is_current_user_superadmin())
  WITH CHECK (public.is_current_user_superadmin());

CREATE POLICY "Authenticated superadmins can manage trainer profiles" 
  ON public.master_trainer_profiles 
  FOR ALL 
  TO authenticated
  USING (public.is_current_user_superadmin())
  WITH CHECK (public.is_current_user_superadmin());

CREATE POLICY "Authenticated superadmins can manage trainer materials" 
  ON public.master_trainer_materials 
  FOR ALL 
  TO authenticated
  USING (public.is_current_user_superadmin())
  WITH CHECK (public.is_current_user_superadmin());

CREATE POLICY "Authenticated superadmins can manage trainer recordings" 
  ON public.master_trainer_recordings 
  FOR ALL 
  TO authenticated
  USING (public.is_current_user_superadmin())
  WITH CHECK (public.is_current_user_superadmin());

CREATE POLICY "Authenticated superadmins can manage trainer FAQs" 
  ON public.master_trainer_faqs 
  FOR ALL 
  TO authenticated
  USING (public.is_current_user_superadmin())
  WITH CHECK (public.is_current_user_superadmin());

-- Create indexes for better performance
CREATE INDEX idx_master_trainer_profiles_user_id ON public.master_trainer_profiles(user_id);
CREATE INDEX idx_master_trainer_materials_category ON public.master_trainer_materials(category);
CREATE INDEX idx_master_trainer_recordings_category ON public.master_trainer_recordings(category);
CREATE INDEX idx_master_trainer_faqs_category ON public.master_trainer_faqs(category);
