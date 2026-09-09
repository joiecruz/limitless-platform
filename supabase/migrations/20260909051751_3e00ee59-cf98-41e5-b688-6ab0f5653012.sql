ALTER TABLE public.ikigai_waitlist
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS employee_count text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS referral_source text;

CREATE OR REPLACE FUNCTION public.validate_ikigai_waitlist()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.email := lower(trim(NEW.email));
  NEW.full_name := trim(NEW.full_name);
  NEW.business_or_profession := trim(NEW.business_or_profession);
  NEW.system_to_build := trim(NEW.system_to_build);
  NEW.first_name := nullif(trim(NEW.first_name), '');
  NEW.last_name := nullif(trim(NEW.last_name), '');
  NEW.company_name := nullif(trim(NEW.company_name), '');
  NEW.employee_count := nullif(trim(NEW.employee_count), '');
  NEW.industry := nullif(trim(NEW.industry), '');
  NEW.referral_source := nullif(trim(NEW.referral_source), '');

  IF length(NEW.full_name) < 1 OR length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name';
  END IF;
  IF length(NEW.email) > 255 OR NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF length(NEW.business_or_profession) < 1 OR length(NEW.business_or_profession) > 160 THEN
    RAISE EXCEPTION 'Invalid business or profession';
  END IF;
  IF length(NEW.system_to_build) < 10 OR length(NEW.system_to_build) > 1000 THEN
    RAISE EXCEPTION 'Invalid system description';
  END IF;
  IF NEW.first_name IS NOT NULL AND length(NEW.first_name) > 80 THEN RAISE EXCEPTION 'Invalid first name'; END IF;
  IF NEW.last_name IS NOT NULL AND length(NEW.last_name) > 80 THEN RAISE EXCEPTION 'Invalid last name'; END IF;
  IF NEW.company_name IS NOT NULL AND length(NEW.company_name) > 160 THEN RAISE EXCEPTION 'Invalid company name'; END IF;
  IF NEW.employee_count IS NOT NULL AND NEW.employee_count NOT IN ('Just me', '2–10', '11–50', '51–200', '201+') THEN RAISE EXCEPTION 'Invalid employee count'; END IF;
  IF NEW.industry IS NOT NULL AND length(NEW.industry) > 100 THEN RAISE EXCEPTION 'Invalid industry'; END IF;
  IF NEW.referral_source IS NOT NULL AND length(NEW.referral_source) > 100 THEN RAISE EXCEPTION 'Invalid referral source'; END IF;
  RETURN NEW;
END;
$$;