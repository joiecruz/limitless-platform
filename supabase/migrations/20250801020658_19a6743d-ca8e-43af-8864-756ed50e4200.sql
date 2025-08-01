-- Create training reports table for master trainers
CREATE TABLE public.training_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('hour_of_code', 'depth_training')),
  trainer_full_name TEXT NOT NULL,
  workshop_date DATE NOT NULL,
  workshop_location TEXT NOT NULL,
  region TEXT NOT NULL,
  province TEXT NOT NULL,
  lgu TEXT NOT NULL,
  affiliation_type TEXT NOT NULL CHECK (affiliation_type IN ('School', 'Community', 'Workplace', 'University')),
  affiliation_name TEXT NOT NULL,
  total_participants INTEGER NOT NULL CHECK (total_participants > 0),
  youth_count INTEGER NOT NULL CHECK (youth_count >= 0),
  parent_count INTEGER NOT NULL CHECK (parent_count >= 0),
  educator_count INTEGER NOT NULL CHECK (educator_count >= 0),
  photo_urls TEXT[] DEFAULT '{}',
  attendance_sheet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT participant_count_check CHECK (youth_count + parent_count + educator_count = total_participants)
);

-- Enable RLS
ALTER TABLE public.training_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own training reports" 
ON public.training_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own training reports" 
ON public.training_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training reports" 
ON public.training_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can view all training reports" 
ON public.training_reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_superadmin = true
));

CREATE POLICY "Superadmins can manage all training reports" 
ON public.training_reports 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_superadmin = true
));

-- Create trigger for updated_at
CREATE TRIGGER update_training_reports_updated_at
BEFORE UPDATE ON public.training_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_training_reports_user_id ON public.training_reports(user_id);
CREATE INDEX idx_training_reports_session_type ON public.training_reports(session_type);
CREATE INDEX idx_training_reports_workshop_date ON public.training_reports(workshop_date);