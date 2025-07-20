-- Enable RLS on workspace_members table
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "Workspace members can view all members in their workspace" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace members can view all members in their workspace via view" ON workspace_members_view;

-- Create a simple policy that allows workspace members to see all members in the same workspace
CREATE POLICY "Workspace members can view all members in their workspace" 
ON public.workspace_members 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if the current user is a member of the same workspace
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Alternative approach: Use a SECURITY DEFINER function that definitely works
CREATE OR REPLACE FUNCTION can_access_workspace_members(target_workspace_id uuid)
RETURNS boolean AS $$
BEGIN
  -- This function runs with SECURITY DEFINER, so it bypasses RLS
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = target_workspace_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative policy using the function
-- CREATE POLICY "Workspace members can view all members in their workspace via function" 
-- ON public.workspace_members 
-- FOR SELECT 
-- TO authenticated 
-- USING (can_access_workspace_members(workspace_id)); 