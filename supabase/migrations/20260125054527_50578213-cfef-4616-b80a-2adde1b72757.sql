-- Add slug column to courses table for SEO-friendly URLs
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS courses_slug_unique ON public.courses(slug) WHERE slug IS NOT NULL;

-- Create a function to generate slug from title
CREATE OR REPLACE FUNCTION generate_course_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM public.courses WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::TEXT;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing courses to have slugs based on their titles
UPDATE public.courses 
SET slug = generate_course_slug(title)
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing rows
ALTER TABLE public.courses ALTER COLUMN slug SET NOT NULL;

-- Create trigger to auto-generate slug for new courses
CREATE OR REPLACE FUNCTION auto_generate_course_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_course_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courses_auto_slug ON public.courses;
CREATE TRIGGER courses_auto_slug
BEFORE INSERT ON public.courses
FOR EACH ROW
EXECUTE FUNCTION auto_generate_course_slug();