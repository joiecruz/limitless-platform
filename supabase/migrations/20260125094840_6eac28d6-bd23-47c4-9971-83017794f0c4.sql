-- Drop the problematic trigger that references a non-existent updated_at column
DROP TRIGGER IF EXISTS update_pending_course_enrollments_updated_at ON pending_course_enrollments;

-- Mark the pending enrollment as processed for the user who has already enrolled
UPDATE pending_course_enrollments 
SET processed_at = now() 
WHERE email = 'maryjoie.cruz@gmail.com' 
AND course_id = 'e0ac8d90-bdba-4a50-a3bd-148c0903d43f'
AND processed_at IS NULL;