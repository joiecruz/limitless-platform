
-- 1. Remove public read on message-attachments bucket (private bucket)
DROP POLICY IF EXISTS "Give public access to message-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Give public read access to message-attachments" ON storage.objects;

-- 2. Restrict master_trainer_profiles SELECT to own row or superadmin
DROP POLICY IF EXISTS "Master trainers and superadmins can view trainer profiles" ON public.master_trainer_profiles;
CREATE POLICY "Trainers can view their own profile or superadmins all"
ON public.master_trainer_profiles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_current_user_superadmin_safe()
);

-- 3. Drop weak insert on stage_contents
DROP POLICY IF EXISTS "Allow insert for auth users" ON public.stage_contents;

-- 4. Drop self-insert on user_course_access (rely on admin/superadmin grants)
DROP POLICY IF EXISTS "Users can insert their own course access" ON public.user_course_access;

-- 5. Drop blanket authenticated-manage on toolkit_items (rely on admin policy)
DROP POLICY IF EXISTS "Authenticated users can manage toolkit items" ON public.toolkit_items;

-- 6. Restrict innovation-tools bucket mutations to admins
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update and delete their files" ON storage.objects;

CREATE POLICY "Admins can upload to innovation-tools"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'innovation-tools'
  AND public.is_current_user_admin_or_superadmin()
);

CREATE POLICY "Admins can update innovation-tools"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'innovation-tools'
  AND public.is_current_user_admin_or_superadmin()
);

CREATE POLICY "Admins can delete innovation-tools"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'innovation-tools'
  AND public.is_current_user_admin_or_superadmin()
);

-- 7. Scope reports-attachments uploads to user's own folder
DROP POLICY IF EXISTS "Allow authenticated uploads to reports-attachments" ON storage.objects;
CREATE POLICY "Users can upload to their own reports-attachments folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reports-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 8. Restrict workspace_invitations SELECT: members see own invite (by email),
--    admins/owners/superadmins see all for workspace
DROP POLICY IF EXISTS "workspace_invitations_select" ON public.workspace_invitations;
DROP POLICY IF EXISTS "Secure workspace invitation access" ON public.workspace_invitations;
CREATE POLICY "workspace_invitations_select"
ON public.workspace_invitations
FOR SELECT
TO authenticated
USING (
  email = (SELECT profiles.email FROM public.profiles WHERE profiles.id = auth.uid())
  OR public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
);

-- 9. Prevent self-inserting into workspace_members with arbitrary role.
--    Server-side invitation acceptance uses service-role and bypasses RLS.
DROP POLICY IF EXISTS "workspace_members_insert" ON public.workspace_members;

-- 10. Restrict issue-attachments reads to the uploader (or admins via existing policy)
DROP POLICY IF EXISTS "Allow users to access their own issue attachments" ON storage.objects;
CREATE POLICY "Users can read their own issue attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = 'issue-attachments'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- 11. Harden function search_path for warnings
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.generate_course_slug(text) SET search_path = public;
ALTER FUNCTION public.auto_generate_course_slug() SET search_path = public;
ALTER FUNCTION public.update_issue_reports_updated_at() SET search_path = public;
ALTER FUNCTION public.refresh_workspace_members_materialized() SET search_path = public;
ALTER FUNCTION public.trigger_refresh_workspace_members_materialized() SET search_path = public;
ALTER FUNCTION public.cleanup_expired_otp_codes() SET search_path = public;
ALTER FUNCTION public.update_course_enrollment_count() SET search_path = public;
ALTER FUNCTION public.handle_message_reaction_change() SET search_path = public;
