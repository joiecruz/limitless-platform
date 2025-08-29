-- SECURITY FIX: Address remaining Security Definer View issues
-- The issue appears to be with materialized views or views that might have
-- SECURITY DEFINER properties or access patterns that bypass RLS

-- Drop and recreate the workspace_members_materialized view without security definer
DROP MATERIALIZED VIEW IF EXISTS public.workspace_members_materialized;

-- Recreate as a regular view instead of materialized view to avoid security issues
-- This removes the potential security definer behavior
CREATE OR REPLACE VIEW public.workspace_members_materialized AS
SELECT 
    wm.user_id,
    wm.workspace_id,
    wm.role AS member_role,
    wm.created_at AS member_created_at,
    wm.last_active,
    p.first_name,
    p.last_name,
    p.email,
    p.id AS profile_id,
    wi.id AS invitation_id,
    wi.role AS invitation_role,
    wi.status AS invitation_status,
    wi.created_at AS invitation_created_at,
    wi.accepted_at,
    wi.invited_by,
    wi.expires_at,
    CASE
        WHEN (wi.status = 'pending'::text) THEN 'Pending'::text
        WHEN (wi.status = 'accepted'::text) THEN 'Active'::text
        WHEN (wi.status = 'rejected'::text) THEN 'Rejected'::text
        ELSE 'Active'::text
    END AS display_status
FROM ((workspace_members wm
   JOIN profiles p ON ((wm.user_id = p.id)))
   LEFT JOIN workspace_invitations wi ON (((wi.email = p.email) AND (wi.workspace_id = wm.workspace_id))));

-- Enable RLS on the view
ALTER VIEW public.workspace_members_materialized ENABLE ROW LEVEL SECURITY;

-- Create a policy for the view to respect workspace membership
CREATE POLICY "workspace_members_materialized_access" 
ON public.workspace_members_materialized 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if the current user is a member of the same workspace
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR
  -- Allow superadmins to see all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);

-- Drop the refresh function since we're not using a materialized view anymore
DROP FUNCTION IF EXISTS public.refresh_workspace_members_materialized();
DROP FUNCTION IF EXISTS public.trigger_refresh_workspace_members_materialized();

-- Also check and fix the other views that might have security issues
-- Drop and recreate workspace_members_with_invitations view with proper RLS
DROP VIEW IF EXISTS public.workspace_members_with_invitations;

CREATE OR REPLACE VIEW public.workspace_members_with_invitations AS
SELECT 
    wm.user_id,
    wm.workspace_id,
    wm.role AS member_role,
    wm.created_at AS member_created_at,
    wm.last_active,
    p.first_name,
    p.last_name,
    p.email,
    p.id AS profile_id,
    wi.id AS invitation_id,
    wi.role AS invitation_role,
    wi.status AS invitation_status,
    wi.created_at AS invitation_created_at,
    wi.accepted_at,
    wi.invited_by,
    wi.expires_at,
    CASE
        WHEN (wi.status = 'pending'::text) THEN 'Pending'::text
        WHEN (wi.status = 'accepted'::text) THEN 'Active'::text
        WHEN (wi.status = 'rejected'::text) THEN 'Rejected'::text
        ELSE 'Active'::text
    END AS display_status
FROM ((workspace_members wm
   JOIN profiles p ON ((wm.user_id = p.id)))
   LEFT JOIN workspace_invitations wi ON (((wi.email = p.email) AND (wi.workspace_id = wm.workspace_id))));

-- Enable RLS on this view too
ALTER VIEW public.workspace_members_with_invitations ENABLE ROW LEVEL SECURITY;

-- Create a policy for this view as well
CREATE POLICY "workspace_members_with_invitations_access" 
ON public.workspace_members_with_invitations 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if the current user is a member of the same workspace
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR
  -- Allow superadmins to see all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);