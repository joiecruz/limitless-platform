-- Grant course access to the test user who signed up via invitation
INSERT INTO public.user_course_access (user_id, course_id)
SELECT '6eecee8c-c21c-44d8-9c9c-f1a0d858d795', 'e0ac8d90-bdba-4a50-a3bd-148c0903d43f'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_course_access 
  WHERE user_id = '6eecee8c-c21c-44d8-9c9c-f1a0d858d795' 
  AND course_id = 'e0ac8d90-bdba-4a50-a3bd-148c0903d43f'
);