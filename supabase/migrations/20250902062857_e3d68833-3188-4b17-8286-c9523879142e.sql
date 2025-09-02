-- SECURITY FIX: Fix workspaces table RLS policies to prevent data leakage
-- Current situation: Users cannot access workspaces due to conflicting or missing policies

-- First, check what policies currently exist for workspaces table
-- Then drop all existing policies and create secure, non-conflicting ones

-- Drop all existing workspace policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated users to view workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Allow superadmins to view all workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Allow workspace members to view their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can read workspaces they are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace members can read workspace details" ON public.workspaces;
DROP POLICY IF EXISTS "Allow authenticated users to create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Superadmins can manage all workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace admins can update workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete workspaces" ON public.workspaces;

-- Create new secure workspace policies

-- Allow users to view workspaces they are members of (or superadmins can view all)
CREATE POLICY "Members can view their workspaces" 
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
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);

-- Allow authenticated users to create new workspaces
CREATE POLICY "Authenticated users can create workspaces" 
ON public.workspaces 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow workspace admins and owners to update workspace details (or superadmins)
CREATE POLICY "Admins and owners can update workspaces" 
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
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);

-- Allow workspace owners to delete workspaces (or superadmins)
CREATE POLICY "Owners can delete workspaces" 
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
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);