-- Add location fields to training_session_reports table
ALTER TABLE public.training_session_reports 
ADD COLUMN region TEXT,
ADD COLUMN province TEXT, 
ADD COLUMN lgu TEXT;