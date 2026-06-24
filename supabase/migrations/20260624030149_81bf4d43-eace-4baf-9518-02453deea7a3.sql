
-- 1) Remove permissive workspaces INSERT policy (duplicate of "User workspace creation")
DROP POLICY IF EXISTS "allow_workspace_insert" ON public.workspaces;

-- 2) Storage: master-trainer-reports - allow trainers to update/delete own files
DROP POLICY IF EXISTS "Master trainers can update their own report files" ON storage.objects;
CREATE POLICY "Master trainers can update their own report files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'master-trainer-reports' AND (storage.foldername(name))[1] = (auth.uid())::text)
WITH CHECK (bucket_id = 'master-trainer-reports' AND (storage.foldername(name))[1] = (auth.uid())::text);

DROP POLICY IF EXISTS "Master trainers can delete their own report files" ON storage.objects;
CREATE POLICY "Master trainers can delete their own report files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'master-trainer-reports' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- 3) Storage: reports-attachments - allow users to update/delete own files
DROP POLICY IF EXISTS "Users can update their own reports-attachments" ON storage.objects;
CREATE POLICY "Users can update their own reports-attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'reports-attachments' AND (storage.foldername(name))[1] = (auth.uid())::text)
WITH CHECK (bucket_id = 'reports-attachments' AND (storage.foldername(name))[1] = (auth.uid())::text);

DROP POLICY IF EXISTS "Users can delete their own reports-attachments" ON storage.objects;
CREATE POLICY "Users can delete their own reports-attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'reports-attachments' AND (storage.foldername(name))[1] = (auth.uid())::text);

-- 4) Storage: user-uploads (issue-attachments) - allow users to update/delete own files
DROP POLICY IF EXISTS "Users can update their own issue attachments" ON storage.objects;
CREATE POLICY "Users can update their own issue attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = 'issue-attachments'
  AND (storage.foldername(name))[2] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = 'issue-attachments'
  AND (storage.foldername(name))[2] = (auth.uid())::text
);

DROP POLICY IF EXISTS "Users can delete their own issue attachments" ON storage.objects;
CREATE POLICY "Users can delete their own issue attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = 'issue-attachments'
  AND (storage.foldername(name))[2] = (auth.uid())::text
);

-- 5) Storage: message-attachments - allow workspace members to view attachments uploaded by other workspace members
DROP POLICY IF EXISTS "Workspace members can read message-attachments" ON storage.objects;
CREATE POLICY "Workspace members can read message-attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND EXISTS (
    SELECT 1
    FROM public.workspace_members wm_self
    JOIN public.workspace_members wm_uploader
      ON wm_uploader.workspace_id = wm_self.workspace_id
    WHERE wm_self.user_id = auth.uid()
      AND wm_uploader.user_id::text = (storage.foldername(name))[1]
  )
);

-- 6) Lock down SECURITY DEFINER functions:
--    Revoke EXECUTE from PUBLIC + anon for ALL public security definer functions.
--    Additionally revoke from authenticated for pure trigger/internal helpers.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon',
                   r.nspname, r.proname, r.args);
  END LOOP;
END$$;

-- Trigger-only / internal functions: also revoke from authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_privilege_escalation() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_course_slug(text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_generate_course_slug() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_issue_reports_updated_at() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.cocreation_update_upvote_count() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_message_reaction_change() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_course_enrollment_count() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_workspace_members_materialized() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_refresh_workspace_members_materialized() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_invitations() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_otp_codes() FROM authenticated;

-- Cocreation helpers are intentionally callable by anon participants (token-based); restore anon EXECUTE
GRANT EXECUTE ON FUNCTION public.cocreation_session_is_public(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.cocreation_session_is_live(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_cocreation_participant_by_token(uuid, text) TO anon;
