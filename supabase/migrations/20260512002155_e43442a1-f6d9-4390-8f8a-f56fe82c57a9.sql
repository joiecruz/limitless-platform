
-- 1. Message attachments: restrict SELECT to uploader's folder
DROP POLICY IF EXISTS "Authenticated users can read message-attachments" ON storage.objects;
CREATE POLICY "Users can read own message-attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 2. Issue attachments: scope INSERT to user's own subfolder
DROP POLICY IF EXISTS "Allow authenticated uploads to issue-attachments" ON storage.objects;
CREATE POLICY "Users can upload to own issue-attachments folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads'
  AND (storage.foldername(name))[1] = 'issue-attachments'
  AND (storage.foldername(name))[2] = (auth.uid())::text
);

-- 3. Projects: remove broad member-level delete (keep owner/admin delete)
DROP POLICY IF EXISTS "Users can delete projects in their workspaces" ON public.projects;

-- 4. Workspace members: remove self-update (prevents role escalation)
DROP POLICY IF EXISTS "workspace_members_update" ON public.workspace_members;

-- 5. Profiles: prevent users from modifying admin flags on themselves
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only enforce when the row owner is acting on themselves and is not a superadmin
  IF auth.uid() = NEW.id AND NOT public.is_current_user_superadmin_safe() THEN
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'Not allowed to modify is_admin on your own profile';
    END IF;
    IF NEW.is_superadmin IS DISTINCT FROM OLD.is_superadmin THEN
      RAISE EXCEPTION 'Not allowed to modify is_superadmin on your own profile';
    END IF;
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Not allowed to modify role on your own profile';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Co-creation participants: hide anon_token from public reads
-- Replace open SELECT policy with one that excludes the token column via column-level revoke
REVOKE SELECT (anon_token) ON public.cocreation_participants FROM anon, authenticated;

-- Provide secure RPC for participants to look up their own row by token
CREATE OR REPLACE FUNCTION public.get_cocreation_participant_by_token(
  p_session_id uuid,
  p_anon_token text
)
RETURNS TABLE (id uuid, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, display_name
  FROM public.cocreation_participants
  WHERE session_id = p_session_id
    AND anon_token = p_anon_token
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_cocreation_participant_by_token(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_cocreation_participant_by_token(uuid, text) TO anon, authenticated;
