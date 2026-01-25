-- Create a function to get course counts that bypasses RLS
-- This is safe because we're only returning aggregate counts, not actual data
CREATE OR REPLACE FUNCTION public.get_course_counts(course_id_param uuid)
RETURNS TABLE(lesson_count bigint, enrollee_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM lessons WHERE course_id = course_id_param) as lesson_count,
    (SELECT COUNT(*) FROM enrollments WHERE course_id = course_id_param) as enrollee_count;
$$;