
-- ============================================
-- CHANNELS: remove public-read "Enable read access for all users"
-- ============================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.channels;

-- ============================================
-- MESSAGE_REACTIONS: remove public INSERT policy
-- ============================================
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.message_reactions;

-- ============================================
-- MESSAGES: fix broken superadmin delete policy
-- ============================================
DROP POLICY IF EXISTS "superadmin can delete any messages" ON public.messages;

CREATE POLICY "Users or admins can delete messages"
ON public.messages
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (p.is_superadmin = true OR p.is_admin = true)
  )
);

-- ============================================
-- PROJECTS: remove fully-public read policy
-- ============================================
DROP POLICY IF EXISTS "Users can view all projects" ON public.projects;

-- ============================================
-- WORKSPACE_MEMBERS: drop overly-permissive policies and re-scope
-- ============================================
DROP POLICY IF EXISTS "workspace_members_delete_policy" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_policy" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_policy" ON public.workspace_members;
DROP POLICY IF EXISTS "allow_member_insert" ON public.workspace_members;

-- Helper: check whether the current user is admin/owner of a given workspace
CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_owner_of(_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = _workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
  );
$$;

-- INSERT: only workspace admins/owners (or platform superadmins) can add members
CREATE POLICY "workspace_admins_can_add_members"
ON public.workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
);

-- UPDATE: only workspace admins/owners (or platform superadmins) can change roles
CREATE POLICY "workspace_admins_can_update_members"
ON public.workspace_members
FOR UPDATE
TO authenticated
USING (
  public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
)
WITH CHECK (
  public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
);

-- DELETE: members can leave themselves; admins/owners (or superadmins) can remove others
CREATE POLICY "workspace_members_delete_self_or_admin"
ON public.workspace_members
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
);
