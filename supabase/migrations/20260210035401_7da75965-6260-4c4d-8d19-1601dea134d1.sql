
-- Create platform_updates table for changelog entries
CREATE TABLE public.platform_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version VARCHAR(50),
  title TEXT NOT NULL,
  description TEXT,
  changes JSONB DEFAULT '[]'::jsonb,
  update_type VARCHAR(50) DEFAULT 'improvement' CHECK (update_type IN ('feature', 'improvement', 'bugfix', 'security', 'maintenance')),
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.platform_updates ENABLE ROW LEVEL SECURITY;

-- Public read access for published updates
CREATE POLICY "Anyone can view published updates"
  ON public.platform_updates FOR SELECT
  USING (published = true);

-- Admin write access
CREATE POLICY "Admins can manage updates"
  ON public.platform_updates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superadmin = true))
  );

-- Seed with initial entries based on recent changes
INSERT INTO public.platform_updates (version, title, description, changes, update_type, published_at) VALUES
('1.2.0', 'Course Invitation Improvements', 'Improved the course invitation system to better handle existing users.', '["Existing users now get immediate course access when invited", "Improved email templates with context-aware CTAs", "Fixed pending enrollment processing for registered users"]'::jsonb, 'improvement', now()),
('1.1.0', 'Platform Stability Updates', 'Various bug fixes and performance improvements across the platform.', '["Fixed edge function variable references", "Improved error handling in course invitations", "Enhanced email delivery reliability"]'::jsonb, 'bugfix', now() - interval '7 days'),
('1.0.0', 'Platform Launch', 'Initial release of the Limitless Lab platform with core features.', '["Innovation project management", "Course and workshop system", "Design challenge collaboration", "Toolkit and resource library", "Community messaging"]'::jsonb, 'feature', now() - interval '30 days');
