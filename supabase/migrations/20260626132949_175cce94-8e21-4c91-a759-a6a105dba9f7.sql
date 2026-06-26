
-- 1. profiles_update_allows_self_promotion: attach trigger blocking privilege escalation
DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 2. secrets: replace inline profile subqueries with safe helper function
DROP POLICY IF EXISTS "Only superadmins can read secrets" ON public.secrets;
DROP POLICY IF EXISTS "Only superadmins can insert secrets" ON public.secrets;
DROP POLICY IF EXISTS "Only superadmins can update secrets" ON public.secrets;
DROP POLICY IF EXISTS "Only superadmins can delete secrets" ON public.secrets;
DROP POLICY IF EXISTS "Superadmins can manage secrets except select" ON public.secrets;

CREATE POLICY "Only superadmins can read secrets" ON public.secrets
  FOR SELECT TO authenticated
  USING (public.is_current_user_superadmin_safe());

CREATE POLICY "Only superadmins can insert secrets" ON public.secrets
  FOR INSERT TO authenticated
  WITH CHECK (public.is_current_user_superadmin_safe());

CREATE POLICY "Only superadmins can update secrets" ON public.secrets
  FOR UPDATE TO authenticated
  USING (public.is_current_user_superadmin_safe())
  WITH CHECK (public.is_current_user_superadmin_safe());

CREATE POLICY "Only superadmins can delete secrets" ON public.secrets
  FOR DELETE TO authenticated
  USING (public.is_current_user_superadmin_safe());

-- 3. cocreation_participants_anon_token_exposure: hide anon_token from public SELECT
REVOKE SELECT (anon_token) ON public.cocreation_participants FROM anon, authenticated;
-- Managers (via separate policy + cocreation_can_manage) still don't get raw token via REST,
-- but server-side service_role and the get_cocreation_participant_by_token RPC remain available.

-- 4. message_attachments_cross_workspace_read: restrict to members of the channel's workspace
DROP POLICY IF EXISTS "Workspace members can read message-attachments" ON storage.objects;
CREATE POLICY "Workspace members can read message-attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'message-attachments'
    AND (
      -- uploader can always read their own
      (storage.foldername(objects.name))[1] = (auth.uid())::text
      OR EXISTS (
        SELECT 1
        FROM public.messages m
        JOIN public.channels c ON c.id = m.channel_id
        JOIN public.workspace_members wm
          ON wm.workspace_id = c.workspace_id
         AND wm.user_id = auth.uid()
        WHERE m.image_url LIKE '%' || objects.name
      )
    )
  );

-- 5. SUPA_rls_policy_always_true: tighten ati_leads INSERT policy
DROP POLICY IF EXISTS "Anyone can submit ATI leads" ON public.ati_leads;
CREATE POLICY "Anyone can submit ATI leads" ON public.ati_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(first_name, ''))) > 0
    AND length(trim(coalesce(email, ''))) > 3
    AND email LIKE '%_@_%.__%'
    AND length(trim(coalesce(organization, ''))) > 0
    AND persona IS NOT NULL
    AND answers IS NOT NULL
    AND pillar_scores IS NOT NULL
  );

-- 6. SECURITY DEFINER executable findings: revoke EXECUTE from anon/authenticated/PUBLIC
-- on internal trigger and cleanup functions that should never be invoked via the API.
DO $$
DECLARE fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.handle_new_user()',
    'public.update_updated_at_column()',
    'public.update_issue_reports_updated_at()',
    'public.update_course_enrollment_count()',
    'public.auto_generate_course_slug()',
    'public.generate_course_slug(text)',
    'public.handle_message_reaction_change()',
    'public.cocreation_update_upvote_count()',
    'public.prevent_profile_privilege_escalation()',
    'public.trigger_refresh_workspace_members_materialized()',
    'public.refresh_workspace_members_materialized()',
    'public.cleanup_expired_invitations()',
    'public.cleanup_expired_otp_codes()'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
  END LOOP;
END$$;
