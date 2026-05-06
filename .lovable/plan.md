## Goal
Allow workspace admins and workspace members (not just session owner/admin) to delete ideas (responses) from the co-creation dashboard.

## Changes

### 1. Database (migration)
Replace the `Manager can delete responses` RLS policy on `public.cocreation_responses` with one that allows any member of the session's workspace to delete.

```sql
DROP POLICY "Manager can delete responses" ON public.cocreation_responses;

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
```

### 2. Frontend: `src/pages/projects/co-creation/CoCreationDashboard.tsx`
- Add a small trash icon button on each idea card (next to the upvote badge) visible to authenticated dashboard viewers.
- On click: open a `ConfirmationDialog` ("Delete this idea?"), then call `supabase.from("cocreation_responses").delete().eq("id", r.id)`.
- Optimistically remove from local `responses` state; rollback + toast on error.
- Realtime DELETE handler already removes it for other viewers.
- Show all ideas (not just first 8) or keep current slice — keep current slice; delete works regardless.

### 3. No changes to public participant view
Participants on `CoCreationPublic.tsx` still cannot delete (RLS denies anon).

## Notes
- Dashboard route is already gated to authenticated workspace context, so any logged-in workspace member loading it will be allowed by the new policy.
- Cascade on `cocreation_upvotes` already handles upvote cleanup via FK `ON DELETE CASCADE` + trigger.
