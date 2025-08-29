-- SECURITY FIX: Address Security Definer View vulnerability
-- The issue is that some SECURITY DEFINER functions may be too permissive
-- and could be exploited to bypass RLS policies

-- First, let's review and fix problematic SECURITY DEFINER functions
-- Some functions like is_workspace_member should be more restrictive

-- Drop and recreate functions with proper security controls
-- These functions are used in RLS policies, so they need SECURITY DEFINER,
-- but we should make them more restrictive

-- Fix is_workspace_member to ensure it only works for the authenticated user
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id_param uuid)
RETURNS boolean AS $$
BEGIN
  -- Only allow checking membership for the current authenticated user
  -- This prevents abuse of the function to check arbitrary user memberships
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_id_param 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fix check_workspace_membership to be more explicit about its purpose
CREATE OR REPLACE FUNCTION public.check_workspace_membership(workspace_id_param uuid)
RETURNS boolean AS $$
BEGIN
  -- This function should only check current user's membership
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_id_param 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- The two-parameter version should only allow checking when called by authorized users
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Only allow superadmins or the user themselves to check membership
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Allow superadmins to check any membership
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  ) THEN
    RETURN EXISTS (
      SELECT 1 
      FROM workspace_members 
      WHERE workspace_members.workspace_id = $1 
      AND workspace_members.user_id = $2
    );
  END IF;
  
  -- Allow users to check their own membership only
  IF auth.uid() = user_id THEN
    RETURN EXISTS (
      SELECT 1 
      FROM workspace_members 
      WHERE workspace_members.workspace_id = $1 
      AND workspace_members.user_id = $2
    );
  END IF;
  
  -- Deny access for checking other users' memberships
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fix is_workspace_admin_or_owner to be more restrictive
CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_owner(workspace_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Only allow checking admin/owner status in specific contexts
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Only allow superadmins or the user themselves to check admin status
  IF NOT (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_superadmin = true)
    OR auth.uid() = user_id
  ) THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_members.workspace_id = $1 
    AND workspace_members.user_id = $2
    AND workspace_members.role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add security comment to track this fix
COMMENT ON FUNCTION public.is_workspace_member(uuid) IS 'Security hardened: Only checks current user membership';
COMMENT ON FUNCTION public.check_workspace_membership(uuid) IS 'Security hardened: Only checks current user membership';
COMMENT ON FUNCTION public.is_workspace_member(uuid, uuid) IS 'Security hardened: Restricted to superadmins and self-checks';
COMMENT ON FUNCTION public.is_workspace_admin_or_owner(uuid, uuid) IS 'Security hardened: Restricted access to admin status checks';