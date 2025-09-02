-- Fix workspaces table RLS policies - list and drop existing ones first
-- Check what policies exist and drop them properly

-- Drop all existing workspace policies individually
DROP POLICY IF EXISTS "Members can view their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Admins and owners can update workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can delete workspaces" ON public.workspaces;

-- List of other possible policy names to drop
DROP POLICY IF EXISTS "Allow authenticated users to view workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Allow superadmins to view all workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Allow workspace members to view their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can read workspaces they are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace members can read workspace details" ON public.workspaces;
DROP POLICY IF EXISTS "Allow authenticated users to create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Superadmins can manage all workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace admins can update workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete workspaces" ON public.workspaces;

-- Now create the new policies
CREATE POLICY "Workspace member access" 
ON public.workspaces 
FOR SELECT 
TO authenticated 
USING (
  -- User is a member of this workspace
  id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR
  -- Or user is a superadmin (can view all workspaces)
  public.is_current_user_superadmin_safe()
);

-- Allow authenticated users to create new workspaces
CREATE POLICY "User workspace creation" 
ON public.workspaces 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow workspace admins and owners to update workspace details (or superadmins)
CREATE POLICY "Workspace admin updates" 
ON public.workspaces 
FOR UPDATE 
TO authenticated 
USING (
  -- User is an admin or owner of this workspace
  id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  )
  OR
  -- Or user is a superadmin
  public.is_current_user_superadmin_safe()
);

-- Allow workspace owners to delete workspaces (or superadmins)
CREATE POLICY "Workspace owner deletion" 
ON public.workspaces 
FOR DELETE 
TO authenticated 
USING (
  -- User is an owner of this workspace
  id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  )
  OR
  -- Or user is a superadmin
  public.is_current_user_superadmin_safe()
);