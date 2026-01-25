-- Create pending_course_enrollments table for MSME bulk invitations
CREATE TABLE public.pending_course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT pending_course_enrollments_email_course_unique UNIQUE (email, course_id)
);

-- Create index for faster lookups by email
CREATE INDEX idx_pending_course_enrollments_email ON public.pending_course_enrollments(email);
CREATE INDEX idx_pending_course_enrollments_course_id ON public.pending_course_enrollments(course_id);
CREATE INDEX idx_pending_course_enrollments_processed ON public.pending_course_enrollments(processed_at);

-- Enable Row Level Security
ALTER TABLE public.pending_course_enrollments ENABLE ROW LEVEL SECURITY;

-- Admins and superadmins can view all pending enrollments
CREATE POLICY "Admins can view all pending enrollments"
ON public.pending_course_enrollments
FOR SELECT
USING (public.is_current_user_admin_or_superadmin());

-- Admins and superadmins can insert pending enrollments
CREATE POLICY "Admins can insert pending enrollments"
ON public.pending_course_enrollments
FOR INSERT
WITH CHECK (public.is_current_user_admin_or_superadmin());

-- Admins and superadmins can update pending enrollments
CREATE POLICY "Admins can update pending enrollments"
ON public.pending_course_enrollments
FOR UPDATE
USING (public.is_current_user_admin_or_superadmin());

-- Admins and superadmins can delete pending enrollments
CREATE POLICY "Admins can delete pending enrollments"
ON public.pending_course_enrollments
FOR DELETE
USING (public.is_current_user_admin_or_superadmin());

-- Authenticated users can check their own pending enrollment by email match
CREATE POLICY "Users can view their own pending enrollment"
ON public.pending_course_enrollments
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);

-- Add trigger for updated_at (using existing function)
CREATE TRIGGER update_pending_course_enrollments_updated_at
BEFORE UPDATE ON public.pending_course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();