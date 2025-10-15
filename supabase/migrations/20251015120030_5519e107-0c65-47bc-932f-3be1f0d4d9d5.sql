-- ==========================================
-- SECURITY FIX: Fix Client-Side Authorization for Sticky Notes
-- ==========================================
-- This migration adds proper RLS policies for sticky_notes to enable
-- server-side authorization instead of relying on client-side checks

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own sticky notes" ON public.sticky_notes;
DROP POLICY IF EXISTS "Users can view sticky notes in their workspace challenges" ON public.sticky_notes;
DROP POLICY IF EXISTS "Users can update their own sticky notes" ON public.sticky_notes;
DROP POLICY IF EXISTS "Users can delete their own sticky notes" ON public.sticky_notes;
DROP POLICY IF EXISTS "Workspace admins can delete any sticky notes" ON public.sticky_notes;

-- 1. CREATE: Users can create sticky notes in challenges they can access
CREATE POLICY "Users can create sticky notes in accessible challenges"
ON public.sticky_notes
FOR INSERT
TO authenticated
WITH CHECK (
  -- User must be a member of the workspace that owns the challenge
  EXISTS (
    SELECT 1
    FROM design_challenges dc
    JOIN workspace_members wm ON wm.workspace_id = dc.workspace_id
    WHERE dc.id = sticky_notes.challenge_id
      AND wm.user_id = auth.uid()
  )
  AND created_by = auth.uid()
);

-- 2. SELECT: Users can view sticky notes in challenges they can access
CREATE POLICY "Users can view sticky notes in accessible challenges"
ON public.sticky_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM design_challenges dc
    JOIN workspace_members wm ON wm.workspace_id = dc.workspace_id
    WHERE dc.id = sticky_notes.challenge_id
      AND wm.user_id = auth.uid()
  )
);

-- 3. UPDATE: Users can update their own sticky notes
CREATE POLICY "Users can update their own sticky notes"
ON public.sticky_notes
FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- 4. DELETE: Complex policy - users can delete their own OR workspace admins/owners can delete any
CREATE POLICY "Users and workspace admins can delete sticky notes"
ON public.sticky_notes
FOR DELETE
TO authenticated
USING (
  -- User created the note
  created_by = auth.uid()
  OR
  -- User is admin/owner in the workspace that owns the challenge
  EXISTS (
    SELECT 1
    FROM design_challenges dc
    JOIN workspace_members wm ON wm.workspace_id = dc.workspace_id
    WHERE dc.id = sticky_notes.challenge_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
  )
);

COMMENT ON POLICY "Users can create sticky notes in accessible challenges" ON public.sticky_notes 
  IS 'Allows authenticated users to create sticky notes in challenges within their workspace';
COMMENT ON POLICY "Users can view sticky notes in accessible challenges" ON public.sticky_notes 
  IS 'Allows workspace members to view all sticky notes in their workspace challenges';
COMMENT ON POLICY "Users can update their own sticky notes" ON public.sticky_notes 
  IS 'Allows users to update only the sticky notes they created';
COMMENT ON POLICY "Users and workspace admins can delete sticky notes" ON public.sticky_notes 
  IS 'Allows users to delete their own notes, and workspace admins/owners to delete any notes in their workspace';