Two issues to fix:

## 1. Co-creation sessions don't appear in the Projects list

Cause: Co-creation sessions are stored in the `cocreation_sessions` table, but `Projects.tsx` only renders rows from `projects` (via `useProjects`) and `design_challenges` (via `useDesignChallenges`). Sessions ARE being saved successfully — they're just never fetched.

Fix:
- Add a new hook `src/hooks/useCoCreationSessions.ts` that fetches `cocreation_sessions` for the current workspace, ordered by `created_at desc`, with a realtime subscription (mirroring `useProjects`).
- In `src/pages/projects/Projects.tsx`:
  - Use the new hook.
  - Render each session as its own card in the existing grid, alongside projects and challenges.
  - Card shows title, description, status badge (`draft` / `live` / `completed`), a small "AI-Assisted Co-Creation" tag, created date, and a delete button (visible to owner / workspace admin).
  - Clicking a session navigates to `/dashboard/projects/co-creation/:id`.
  - Include co-creation sessions in the `searchValue` filter and the empty-state check.
  - Wire up delete: call `supabase.from('cocreation_sessions').delete().eq('id', id)` (RLS already restricts delete to owner / workspace admin / superadmin).

## 2. Add Limitless Lab logo and "AI-Assisted Co-Creation" label to the public ideation page

In `src/pages/projects/co-creation/CoCreationPublic.tsx`, replace the current header (just a Sparkles icon + "Co-Creation" text) with:
- `<img src="/limitless-logo.svg" alt="Limitless Lab" />` on the left.
- A divider, then `Sparkles` icon + "AI-Assisted Co-Creation" label (hidden on very small screens to keep room for the participant badge).
- Keep the existing "You: {displayName}" badge on the right.

This matches the logo treatment used elsewhere (`AuthLogo`, `AdminLayout`).

## Files to change

- `src/hooks/useCoCreationSessions.ts` (new)
- `src/pages/projects/Projects.tsx` (render co-creation cards in the grid + delete handling + search filter)
- `src/pages/projects/co-creation/CoCreationPublic.tsx` (header logo + label)

No database changes needed — RLS already allows workspace members to view/delete their sessions.