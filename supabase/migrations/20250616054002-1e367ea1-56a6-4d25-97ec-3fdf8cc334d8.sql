
-- Add new fields to the courses table for In-Person workshops
ALTER TABLE public.courses 
ADD COLUMN who_is_this_for text,
ADD COLUMN course_curriculum_text text,
ADD COLUMN booking_link text;

-- Add a comment to clarify the purpose of these fields
COMMENT ON COLUMN public.courses.who_is_this_for IS 'Target audience description for the course';
COMMENT ON COLUMN public.courses.course_curriculum_text IS 'Text-based curriculum description for in-person workshops (not lesson-based)';
COMMENT ON COLUMN public.courses.booking_link IS 'URL for booking meetings/sessions for in-person workshops';
