CREATE TABLE public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  role_title text NOT NULL,
  persona text NOT NULL,
  industry text NOT NULL,
  company_size text,
  interests text[] NOT NULL DEFAULT '{}',
  timeline text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.consultation_requests TO anon;
GRANT INSERT, SELECT ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a consultation request"
  ON public.consultation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Superadmins can read consultation requests"
  ON public.consultation_requests
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_superadmin_safe());