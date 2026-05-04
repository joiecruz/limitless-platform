# Allow reopening a session after synthesis

Currently, once synthesis runs the session moves to `synthesizing` → `completed`, and the host has no way to reopen the session for more participation. The header only shows actions for `draft` and `live`.

## Changes

**`src/pages/projects/co-creation/CoCreationDashboard.tsx`** — header action area (around lines 253–264):

- Keep existing:
  - `draft` → "Publish & go live" button
  - `live` → "Pause" button (sets back to draft)
- Add new:
  - `synthesizing` or `completed` → "Reopen for participation" button (Play icon) that sets status back to `live`
  - Also offer a secondary "Move to draft" (sets status to `draft`) so hosts can fully close it again

Reopening just calls the existing `setStatus("live")` — public route already treats `live` as accepting responses, and the QR/public link block already shows for any non-draft status, so it will continue to work.

No DB schema changes, no edge function changes. Status field is free-text (no enum/check constraint) per existing usage.

## Technical notes

- `setStatus` already exists and uses `updateSession` mutation that updates `cocreation_sessions.status`.
- RLS: hosts already update status via existing buttons, so no policy changes needed.
- The synthesis output and visual history remain intact when reopening (separate tables).
