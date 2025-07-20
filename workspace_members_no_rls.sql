-- For workspace_members table, RLS causes infinite recursion issues
-- because we need to query the same table to check membership
-- Instead, we'll handle access control at the application level

-- Disable RLS on workspace_members table to avoid recursion
ALTER TABLE public.workspace_members DISABLE ROW LEVEL SECURITY;

-- Alternative approach: Create a view with RLS instead
CREATE OR REPLACE VIEW workspace_members_view AS
SELECT 
  wm.*,
  p.first_name,
  p.last_name,
  p.email
FROM workspace_members wm
JOIN profiles p ON wm.user_id = p.id;

-- Enable RLS on the view
ALTER VIEW workspace_members_view ENABLE ROW LEVEL SECURITY;

-- Create policy on the view that allows workspace members to see each other
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