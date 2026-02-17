ALTER TABLE public.enrollments
ADD COLUMN last_reminder_sent_at TIMESTAMPTZ DEFAULT NULL;