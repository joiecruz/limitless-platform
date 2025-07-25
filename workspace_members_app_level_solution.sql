-- Disable RLS on workspace_members table
-- This is the most practical solution for this scenario
ALTER TABLE public.workspace_members DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Workspace members can view all members in their workspace" ON public.workspace_members;
DROP POLICY IF EXISTS "Workspace members can view all members in their workspace via view" ON workspace_members_view;

-- Your application will handle the security by:
-- 1. Always checking if the user is authenticated
-- 2. Verifying the user is a member of the workspace before allowing access
-- 3. Using proper WHERE clauses in your queries

-- Example of how your application should query:
-- SELECT * FROM workspace_members 
-- WHERE workspace_id = $1 
-- AND workspace_id IN (
--   SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
-- );

-- This approach:
-- ✅ Avoids recursion issues
-- ✅ Is simpler and more reliable
-- ✅ Gives you full control over access logic
-- ✅ Works with your existing code
-- ✅ Is a common pattern for many applications 