-- Create course_sections table (modules that contain lessons)
CREATE TABLE public.course_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add section_id to lessons (optional - lessons can exist without a section)
ALTER TABLE public.lessons 
ADD COLUMN section_id UUID REFERENCES public.course_sections(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;

-- Policies for course_sections
CREATE POLICY "Anyone can view course sections" 
ON public.course_sections 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage course sections" 
ON public.course_sections 
FOR ALL 
USING (public.is_current_user_admin_or_superadmin_v2());

-- Create trigger for updated_at
CREATE TRIGGER update_course_sections_updated_at
BEFORE UPDATE ON public.course_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_course_sections_course_id ON public.course_sections(course_id);
CREATE INDEX idx_lessons_section_id ON public.lessons(section_id);