DROP POLICY IF EXISTS "Manager can delete responses" ON public.cocreation_responses;

CREATE POLICY "Workspace members can delete responses"
ON public.cocreation_responses FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cocreation_sessions s
    WHERE s.id = cocreation_responses.session_id
      AND (
        public.is_workspace_member_for_view(s.workspace_id)
        OR public.is_current_user_superadmin_safe()
      )
  )
);