
-- 1) Hide anon_token column from public/authenticated reads on cocreation_participants
REVOKE SELECT (anon_token) ON public.cocreation_participants FROM anon, authenticated;

-- 2) Tighten message-attachments storage read policy to require the object name
--    to be matched against the full bucket-prefixed path (not a loose suffix)
DROP POLICY IF EXISTS "Workspace members can read message-attachments" ON storage.objects;
CREATE POLICY "Workspace members can read message-attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND (
    (storage.foldername(name))[1] = (auth.uid())::text
    OR EXISTS (
      SELECT 1
      FROM messages m
      JOIN channels c ON c.id = m.channel_id
      JOIN workspace_members wm
        ON wm.workspace_id = c.workspace_id AND wm.user_id = auth.uid()
      WHERE m.image_url LIKE ('%/message-attachments/' || objects.name)
    )
  )
);

-- 3) Revoke EXECUTE on SECURITY DEFINER helper/utility functions not used by
--    RLS policies or app RPCs. RLS-used and app-called functions are intentionally
--    left executable (e.g., has_role, is_current_user_superadmin_safe, cocreation_*,
--    is_workspace_member*, create_workspace_with_owner, get_admin_analytics,
--    get_course_counts, get_cocreation_participant_by_token, delete_user_data).
REVOKE EXECUTE ON FUNCTION public.check_workspace_membership(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_has_role(app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_course_enrollment_count(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_highest_role(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_current_user_superadmin_v2() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_workspace_admin(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_workspace_admin_or_owner(uuid, uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_workspace_member_secure(uuid, uuid) FROM anon, authenticated, PUBLIC;
