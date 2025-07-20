-- Enable Row Level Security on workspace_members table
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Create SELECT policy that allows workspace members to see all other members with the same workspace_id
-- This policy avoids recursion by using a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION check_workspace_membership(workspace_id_param uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_id_param 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create SELECT policy using the function to avoid recursion
CREATE POLICY "Workspace members can view all members in their workspace" 
ON public.workspace_members 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if the current user is the user_id in the record (self-access)
  user_id = auth.uid()
  OR
  -- Allow access if the current user is a member of the same workspace
  check_workspace_membership(workspace_id)
); 