-- Grant course access to finance@limitlesslab.org for the LimitlessBiz course
INSERT INTO user_course_access (user_id, course_id)
VALUES ('e07d1184-f8b2-40e3-b8d6-557602b1e082', 'e0ac8d90-bdba-4a50-a3bd-148c0903d43f')
ON CONFLICT DO NOTHING;

-- Mark the pending enrollment as processed
UPDATE pending_course_enrollments
SET processed_at = NOW()
WHERE email = 'finance@limitlesslab.org' 
AND course_id = 'e0ac8d90-bdba-4a50-a3bd-148c0903d43f'
AND processed_at IS NULL;