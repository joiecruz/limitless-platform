-- Drop and recreate the function with new return type that includes total_duration
DROP FUNCTION IF EXISTS public.get_course_counts(uuid);

CREATE FUNCTION public.get_course_counts(course_id_param uuid)
RETURNS TABLE(lesson_count bigint, enrollee_count bigint, total_duration bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM lessons WHERE course_id = course_id_param) as lesson_count,
    (SELECT COUNT(*) FROM enrollments WHERE course_id = course_id_param) as enrollee_count,
    (SELECT COALESCE(SUM(duration), 0) FROM lessons WHERE course_id = course_id_param) as total_duration;
$$;