-- Grant anonymous visitors permission to execute the admin-check helper functions
-- used inside public-facing RLS policies (e.g. on articles). These functions are
-- SECURITY DEFINER and simply return false for anonymous callers (no auth.uid()),
-- so granting EXECUTE is safe and does NOT elevate any privilege. Without this
-- grant, PostgREST returns 42501 "permission denied for function" even when
-- another OR-branch of the policy would have allowed the read — breaking
-- anonymous reads of published blog posts, search-engine crawlers, and our
-- sitemap generator.

GRANT EXECUTE ON FUNCTION public.is_current_user_admin_or_superadmin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_superadmin_safe() TO anon;