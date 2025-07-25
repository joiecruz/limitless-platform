-- Create a view of workspace_members
CREATE OR REPLACE VIEW workspace_members_view AS
SELECT * FROM workspace_members;

-- Enable RLS on the view (not the table)
ALTER VIEW workspace_members_view ENABLE ROW LEVEL SECURITY;

-- Create policy on the view that allows members to see each other
CREATE POLICY "Workspace members can view all members in their workspace via view" 
ON workspace_members_view 
FOR SELECT 
TO authenticated 
USING (
  -- Allow access if the current user is the user_id in the record (self-access)
  user_id = auth.uid()
  OR
  -- Allow access if the current user is a member of the same workspace
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Keep the original table without RLS for other operations
ALTER TABLE public.workspace_members DISABLE ROW LEVEL SECURITY; 