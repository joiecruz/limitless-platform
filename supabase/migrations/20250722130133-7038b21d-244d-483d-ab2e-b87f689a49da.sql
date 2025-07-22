
-- Create enum types for the reporting system
CREATE TYPE session_type_enum AS ENUM ('hour_of_code', 'depth_training');
CREATE TYPE affiliation_type_enum AS ENUM ('School', 'Community', 'Workplace', 'University');
CREATE TYPE report_status_enum AS ENUM ('submitted', 'approved', 'rejected');

-- Create master trainer targets table
CREATE TABLE public.master_trainer_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  hour_of_code_target INTEGER NOT NULL DEFAULT 3000,
  depth_training_target INTEGER NOT NULL DEFAULT 600,
  hour_of_code_current INTEGER NOT NULL DEFAULT 0,
  depth_training_current INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create training session reports table
CREATE TABLE public.training_session_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_type session_type_enum NOT NULL,
  trainer_full_name TEXT NOT NULL,
  workshop_date DATE NOT NULL,
  workshop_location TEXT NOT NULL,
  affiliation_type affiliation_type_enum NOT NULL,
  affiliation_name TEXT NOT NULL,
  total_participants INTEGER NOT NULL,
  youth_count INTEGER NOT NULL DEFAULT 0,
  parent_count INTEGER NOT NULL DEFAULT 0,
  educator_count INTEGER NOT NULL DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  attendance_sheet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status report_status_enum NOT NULL DEFAULT 'submitted',
  admin_notes TEXT
);

-- Add RLS policies for master_trainer_targets
ALTER TABLE public.master_trainer_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own targets" 
  ON public.master_trainer_targets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own targets" 
  ON public.master_trainer_targets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own targets" 
  ON public.master_trainer_targets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can manage all targets" 
  ON public.master_trainer_targets 
  FOR ALL 
  USING (is_current_user_superadmin());

-- Add RLS policies for training_session_reports
ALTER TABLE public.training_session_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports" 
  ON public.training_session_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" 
  ON public.training_session_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
  ON public.training_session_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can manage all reports" 
  ON public.training_session_reports 
  FOR ALL 
  USING (is_current_user_superadmin());

-- Add triggers for updated_at columns
CREATE TRIGGER update_master_trainer_targets_updated_at
  BEFORE UPDATE ON public.master_trainer_targets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_session_reports_updated_at
  BEFORE UPDATE ON public.training_session_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for report attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('master-trainer-reports', 'master-trainer-reports', false);

-- Create storage policies for the bucket
CREATE POLICY "Master trainers can upload their own report files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'master-trainer-reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Master trainers can view their own report files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'master-trainer-reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Superadmins can access all report files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'master-trainer-reports' AND
    is_current_user_superadmin()
  );
