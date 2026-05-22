
-- 1. Hide anon_token from public/authenticated readers of cocreation_participants
REVOKE SELECT (anon_token) ON public.cocreation_participants FROM anon, authenticated;

-- 2. Prevent self privilege escalation on profiles via trigger (function already exists)
DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 3. Hide magic_link_token from non-service-role readers of workspace_invitations.
-- Edge functions using service_role still have access; clients (admins/owners/invitees) cannot read it.
REVOKE SELECT (magic_link_token) ON public.workspace_invitations FROM anon, authenticated;

-- 4. Tighten message_reactions INSERT to require channel membership (or public channel)
DROP POLICY IF EXISTS "Users can create message reactions" ON public.message_reactions;
CREATE POLICY "Users can create message reactions"
ON public.message_reactions
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.messages m
    JOIN public.channels c ON c.id = m.channel_id
    WHERE m.id = message_reactions.message_id
      AND (
        c.is_public = true
        OR EXISTS (
          SELECT 1 FROM public.workspace_members wm
          WHERE wm.workspace_id = c.workspace_id
            AND wm.user_id = auth.uid()
        )
      )
  )
);
