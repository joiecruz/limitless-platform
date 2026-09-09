CREATE TABLE public.ikigai_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  business_or_profession text NOT NULL,
  system_to_build text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.ikigai_waitlist TO anon;
GRANT SELECT, INSERT ON public.ikigai_waitlist TO authenticated;
GRANT ALL ON public.ikigai_waitlist TO service_role;

ALTER TABLE public.ikigai_waitlist ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX ikigai_waitlist_email_unique_idx
  ON public.ikigai_waitlist (lower(email));
CREATE INDEX ikigai_waitlist_created_at_idx
  ON public.ikigai_waitlist (created_at DESC);

CREATE OR REPLACE FUNCTION public.validate_ikigai_waitlist_submission()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.full_name := btrim(NEW.full_name);
  NEW.email := lower(btrim(NEW.email));
  NEW.business_or_profession := btrim(NEW.business_or_profession);
  NEW.system_to_build := btrim(NEW.system_to_build);
  NEW.updated_at := now();

  IF char_length(NEW.full_name) < 1 OR char_length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name' USING ERRCODE = '22023';
  END IF;
  IF char_length(NEW.email) < 5 OR char_length(NEW.email) > 255 OR NEW.email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'Invalid email address' USING ERRCODE = '22023';
  END IF;
  IF char_length(NEW.business_or_profession) < 1 OR char_length(NEW.business_or_profession) > 160 THEN
    RAISE EXCEPTION 'Invalid business or profession' USING ERRCODE = '22023';
  END IF;
  IF char_length(NEW.system_to_build) < 10 OR char_length(NEW.system_to_build) > 1000 THEN
    RAISE EXCEPTION 'Invalid system description' USING ERRCODE = '22023';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_ikigai_waitlist_submission() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_ikigai_waitlist_submission() TO service_role;

CREATE TRIGGER validate_ikigai_waitlist_before_write
BEFORE INSERT OR UPDATE ON public.ikigai_waitlist
FOR EACH ROW
EXECUTE FUNCTION public.validate_ikigai_waitlist_submission();

CREATE POLICY "Anyone can join the IKIGAI waitlist"
ON public.ikigai_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(full_name)) BETWEEN 1 AND 120
  AND char_length(btrim(email)) BETWEEN 5 AND 255
  AND lower(btrim(email)) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND char_length(btrim(business_or_profession)) BETWEEN 1 AND 160
  AND char_length(btrim(system_to_build)) BETWEEN 10 AND 1000
);

CREATE POLICY "Admins can view the IKIGAI waitlist"
ON public.ikigai_waitlist
FOR SELECT
TO authenticated
USING (public.is_current_user_admin_or_superadmin());