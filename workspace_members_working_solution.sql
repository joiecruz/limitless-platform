-- Enable RLS on workspace_members table
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "Workspace members can view all members in their workspace" ON public.workspace_members;

-- Create a SECURITY DEFINER function that bypasses RLS to check membership
CREATE OR REPLACE FUNCTION is_workspace_member(workspace_id_param uuid)
RETURNS boolean AS $$
BEGIN
  -- This function runs with SECURITY DEFINER, so it bypasses RLS
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_id_param 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the SELECT policy using the function
CREATE POLICY "Workspace members can view all members in their workspace" 
ON public.workspace_members 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if the current user is a member of the same workspace
  is_workspace_member(workspace_id)
); 