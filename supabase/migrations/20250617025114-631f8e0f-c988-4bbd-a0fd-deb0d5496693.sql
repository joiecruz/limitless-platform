
-- Check existing policies first, then create only missing ones
-- Drop and recreate all policies to ensure they are correct

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners and admins can update workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete workspaces" ON public.workspaces;

-- Create the correct RLS policies for the workspaces table

-- Allow authenticated users to insert workspaces
CREATE POLICY "Authenticated users can create workspaces" 
ON public.workspaces 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to view workspaces they are members of
CREATE POLICY "Users can view workspaces they are members of" 
ON public.workspaces 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_members.workspace_id = workspaces.id 
    AND workspace_members.user_id = auth.uid()
  )
);

-- Allow workspace owners/admins to update workspaces
CREATE POLICY "Workspace owners and admins can update workspaces" 
ON public.workspaces 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_members.workspace_id = workspaces.id 
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.role IN ('owner', 'admin')
  )
);

-- Allow workspace owners to delete workspaces
CREATE POLICY "Workspace owners can delete workspaces" 
ON public.workspaces 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_members.workspace_id = workspaces.id 
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.role = 'owner'
  )
);
