## Goals

1. Ensure new ideas show up live on the host dashboard (and public page) without manual refresh.
2. Allow the host to keep the session live after running synthesis, while showing when synthesis was last run.

## Changes

### 1. Keep session "live" through synthesis + add timestamp

Database migration on `cocreation_sessions`:
- Add `last_synthesis_at timestamptz` column (nullable).

Edge function `cocreation-synthesize`:
- After successful synthesis, set `last_synthesis_at = now()` on the session. Do NOT change `status`.

Dashboard (`CoCreationDashboard.tsx`) `runSynthesis`:
- Remove the lines that flip status to `synthesizing` then `completed`. The session stays in whatever status it was (typically `live`), so participants can keep submitting.
- After synthesis returns, refetch the session so the new `last_synthesis_at` is in state.
- Show a small "Last synthesized: 2 min ago" line near the Run synthesis button. Button label becomes "Re-run synthesis" once a synthesis exists.
- Keep the existing "Reopen for participation" / "Move to draft" controls for sessions that are already in `completed`/`synthesizing` status (legacy sessions).

### 2. Make ideas appear live reliably

Root cause: the dashboard subscribes to `cocreation_responses` via Supabase Realtime, but if the Realtime channel drops or RLS evaluation delays a row, the UI never updates. We add a defensive polling fallback and tighten the realtime handler.

Dashboard (`CoCreationDashboard.tsx`):
- Split the single `load()` into:
  - `loadAll()` — initial full fetch (current behavior).
  - `refreshResponses()` — light fetch of just `cocreation_responses` + `cocreation_participants` for this session.
- Realtime subscription:
  - On `cocreation_responses` INSERT/UPDATE/DELETE → call `refreshResponses()` (not full reload).
  - On `cocreation_sessions` / `cocreation_questions` / `cocreation_outputs` changes → keep current behavior.
  - Log subscription status; if `CHANNEL_ERROR` or `TIMED_OUT`, attempt one re-subscribe.
- Add a 5-second `setInterval` polling fallback that calls `refreshResponses()` while the tab is visible and `session.status === 'live'`. This guarantees ideas appear within ~5s even if realtime is degraded.
- Clear interval on unmount and when document becomes hidden.

Public page (`CoCreationPublic.tsx`):
- Apply the same polling fallback (every 5s while live and visible) so participants see each other's ideas even when realtime hiccups.

### 3. UI polish

- In the "Live responses" section header, add a small green dot + "Live" indicator when `session.status === 'live'`, plus the count of total ideas and a manual "Refresh" icon button.
- Synthesis card shows: "Last synthesized {timeAgo}" when `last_synthesis_at` is set.

## Technical notes

- No RLS changes required; existing policies already allow anon SELECT on responses for public sessions.
- `last_synthesis_at` is purely informational; no triggers needed.
- Polling is cheap (single indexed query by `session_id`) and only runs while the tab is visible.

## Files touched

- `supabase/migrations/<new>.sql` — add `last_synthesis_at` column.
- `supabase/functions/cocreation-synthesize/index.ts` — set timestamp, do not change status.
- `src/pages/projects/co-creation/CoCreationDashboard.tsx` — polling fallback, refactor load, timestamp UI, keep-live synthesis flow.
- `src/pages/projects/co-creation/CoCreationPublic.tsx` — polling fallback.
