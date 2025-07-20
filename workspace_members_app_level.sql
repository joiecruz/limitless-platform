-- Disable RLS on workspace_members table
-- Control access at the application level instead
ALTER TABLE public.workspace_members DISABLE ROW LEVEL SECURITY;

-- Your application code will handle the security by:
-- 1. Checking if the user is authenticated
-- 2. Verifying the user is a member of the workspace before allowing access
-- 3. Using proper WHERE clauses in your queries

-- Example of how your application would handle this:
-- SELECT * FROM workspace_members 
-- WHERE workspace_id = $1 
-- AND workspace_id IN (
--   SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
-- ); 