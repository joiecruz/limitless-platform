-- Option 1: Disable RLS on workspace_members table (simplest solution)
-- This allows all authenticated users to access workspace_members
-- You can control access at the application level instead
ALTER TABLE public.workspace_members DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS, use a different approach with a separate table or view
-- Create a view that doesn't have RLS enabled
CREATE OR REPLACE VIEW workspace_members_view AS
SELECT * FROM workspace_members;

-- Then create a policy on the view instead
CREATE POLICY "Workspace members can view all members in their workspace via view" 
ON workspace_members_view 
FOR SELECT 
TO authenticated 
USING (true);

-- Option 3: Use a function-based approach with SECURITY DEFINER
-- This bypasses RLS for the function execution
CREATE OR REPLACE FUNCTION get_workspace_members(workspace_id_param uuid)
RETURNS TABLE (
  user_id uuid,
  workspace_id uuid,
  role text,
  created_at timestamptz,
  last_active timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT wm.user_id, wm.workspace_id, wm.role, wm.created_at, wm.last_active
  FROM workspace_members wm
  WHERE wm.workspace_id = workspace_id_param
  AND EXISTS (
    SELECT 1 
    FROM workspace_members wm_check
    WHERE wm_check.workspace_id = workspace_id_param
    AND wm_check.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 