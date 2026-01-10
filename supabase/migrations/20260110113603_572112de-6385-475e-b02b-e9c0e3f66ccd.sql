-- Add sections column to lessons table for optional content sections
ALTER TABLE public.lessons
ADD COLUMN sections jsonb DEFAULT NULL;

-- Add a comment to describe the expected structure
COMMENT ON COLUMN public.lessons.sections IS 'Optional JSON array of sections: [{title: string, content: string}]';