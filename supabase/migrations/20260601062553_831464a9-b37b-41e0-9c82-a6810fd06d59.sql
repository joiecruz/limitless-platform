
-- 1. Remove overly-permissive SELECT policy on message_reactions
DROP POLICY IF EXISTS "Users can read message reactions" ON public.message_reactions;

-- 2. Remove creator-only UPDATE policy on stage_contents (workspace-scoped policy remains)
DROP POLICY IF EXISTS "Users can update their own stage_contents" ON public.stage_contents;

-- 3. Make views run as the querying user instead of the view owner
ALTER VIEW public.course_enrollment_counts SET (security_invoker = on);
ALTER VIEW public.workspace_members_with_invitations SET (security_invoker = on);

-- 4. Keep materialized view out of the Data API
REVOKE ALL ON public.workspace_members_materialized FROM anon, authenticated;
