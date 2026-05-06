## Goal

Harden the co-creation public QR experience so ~100 concurrent participants on the same session can join, submit, and upvote without the page degrading or hitting Supabase limits.

## Risk assessment

Looking at `CoCreationPublic.tsx` and `CoCreationDashboard.tsx`, the scaling pain points for 100 users on one session are:

1. **Polling thundering herd.** Both pages poll `cocreation_responses` every 5 s unconditionally, even when the Realtime channel is healthy. With 100 phones polling in lockstep, that's ~1,200 req/min on a single session, plus the dashboard polling participants. Spikes get worse when everyone refreshes at once after the QR scan.
2. **Realtime fan-out + refetch.** Every INSERT/UPDATE/DELETE on `cocreation_responses` triggers a full re-SELECT of all responses + all participants on every connected client. With 100 users actively submitting/upvoting, each upvote can trigger 100 clients to each pull every response and every participant. That's the most likely cause of slowdown / 5xx.
3. **No row caps.** `select("*")` on `cocreation_responses` and `cocreation_participants` has no `.limit()`. Supabase's default cap is 1,000 rows, and we'd be loading every column (including any large `refined_text`) on every poll.
4. **No reconnect / error handling.** If a fetch or the channel errors, state silently goes stale and the user sees an empty board. No retry, no backoff.
5. **Submit / upvote have no debounce or optimistic UI.** Double-tapping the heart on a slow network fires duplicate inserts; the floating "+" can be hit twice in a row.
6. **Anon participant creation race.** First scan triggers an insert into `cocreation_participants`. If a user opens two tabs simultaneously the unique `(session_id, anon_token)` index will reject one — currently we don't catch that error and the page can wedge.
7. **Dashboard left open on a projector** also polls every 5 s and re-renders the entire board on every realtime event.

## Changes

### 1. Smarter polling (biggest win)

- Track Realtime channel health in a ref (`SUBSCRIBED` vs `CHANNEL_ERROR/TIMED_OUT/CLOSED`).
- Only run the 5 s poll when the channel is **not** healthy, or as a slow heartbeat (every 20 s) when it is.
- Add jitter (±1.5 s) so 100 phones don't fire at the exact same second.
- Pause polling when `document.visibilityState !== "visible"` (already partly done — extend to dashboard).
- Stop polling entirely once `session.status === "completed"` and there's no `last_synthesis_at` change pending.

### 2. Lighter realtime handler

- On `cocreation_responses` events, **don't refetch everything**. Use the row in `payload.new` / `payload.old` to update local state in-place:
  - INSERT → append if new id.
  - UPDATE → patch `upvote_count` / `refined_text` on the matching row.
  - DELETE → remove by id.
- Only refetch participants when we encounter a `participant_id` we don't have in the local map (lazy single-row fetch by id).
- Same treatment in `CoCreationDashboard.tsx` so the host's view stays smooth on the projector.

### 3. Query hygiene

- Replace `select("*")` on responses with explicit columns: `id, question_id, original_text, refined_text, upvote_count, participant_id, created_at`.
- Add `.limit(500)` on the initial fetch (more than enough for one event; keeps us well under the 1,000-row default).
- Same for participants: `id, display_name`, `.limit(500)`.

### 4. Resilient submit / upvote

- Disable the floating "+" button while `submitting` (already partly done) and add a 600 ms cooldown after submit.
- Optimistic upvote: flip `myUpvotes` and bump `upvote_count` locally first; on error roll back and toast.
- Wrap inserts in try/catch with one auto-retry on network error before showing the toast.

### 5. Robust anon participant bootstrap

- Wrap the `insert` into `cocreation_participants` in a try/catch. On unique-violation (`23505`), re-`select` by `(session_id, anon_token)` and use that row instead of erroring.
- Add a single retry with exponential backoff if the initial session/questions fetch fails (covers transient 503s during the QR rush).

### 6. Defensive UX

- Show a small "Reconnecting…" pill in the header when the realtime channel is in `CHANNEL_ERROR` / `TIMED_OUT`, so users know the page is recovering rather than thinking it's frozen.
- Wrap the public page in a lightweight error boundary so a single bad row doesn't blank the screen for everyone.
- Keep the existing "Live · auto-refreshing" indicator on the dashboard but tie it to actual channel status.

### 7. Pre-event smoke test (no code, just doc)

- Add a short "Event day checklist" section to `.lovable/plan.md`: open the dashboard on the projector, scan QR on 2–3 devices, submit + upvote, run synthesis, verify session stays live. Documented so the host can dry-run an hour before doors open.

## Files touched

- `src/pages/projects/co-creation/CoCreationPublic.tsx` — smart polling, in-place realtime updates, query limits, optimistic upvote, anon-bootstrap retry, reconnect pill.
- `src/pages/projects/co-creation/CoCreationDashboard.tsx` — same polling/realtime treatment, query limits.
- `.lovable/plan.md` — append event-day checklist.

## Out of scope

- No backend rate limiting (per platform guidance).
- No schema changes; current tables and RLS are already fine for 100 concurrent anon users.
- No queueing layer or edge function for inserts — direct PostgREST insert is sufficient at this scale once polling is calmed down.
