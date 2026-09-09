CREATE TABLE public.pafjo_slide_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  team_size TEXT,
  industry TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.pafjo_slide_leads TO anon;
GRANT INSERT ON public.pafjo_slide_leads TO authenticated;
GRANT SELECT ON public.pafjo_slide_leads TO authenticated;
GRANT ALL ON public.pafjo_slide_leads TO service_role;

ALTER TABLE public.pafjo_slide_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead" ON public.pafjo_slide_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.pafjo_slide_leads
  FOR SELECT TO authenticated
  USING (public.is_current_user_admin_or_superadmin());