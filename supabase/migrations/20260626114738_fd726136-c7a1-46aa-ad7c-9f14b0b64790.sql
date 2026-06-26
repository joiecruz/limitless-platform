CREATE TABLE public.ati_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  referral_source text,
  persona text NOT NULL,
  context text,
  answers jsonb NOT NULL,
  overall_score integer NOT NULL,
  pillar_scores jsonb NOT NULL
);

GRANT INSERT ON public.ati_leads TO anon;
GRANT INSERT, SELECT ON public.ati_leads TO authenticated;
GRANT ALL ON public.ati_leads TO service_role;

ALTER TABLE public.ati_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit ATI leads"
  ON public.ati_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view ATI leads"
  ON public.ati_leads
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_admin_or_superadmin());

CREATE INDEX ati_leads_created_at_idx ON public.ati_leads (created_at DESC);
CREATE INDEX ati_leads_email_idx ON public.ati_leads (email);