## Goal
Stop AI from rewording submitted ideas, switch anonymous identities to unique single-word names, and display the author's name on each idea card.

## Changes

### 1. `src/lib/anonymousName.ts`
- Replace two-word generator with a single-word pool (e.g. `Panda`, `Falcon`, `Otter`, ~80 nouns).
- Append a short numeric suffix only when needed for uniqueness (e.g. `Panda7`).
- Keep the `localStorage` token/name caching for repeat visitors.

### 2. `src/pages/projects/co-creation/CoCreationPublic.tsx`
- Remove the `cocreation-refine-response` invocation in `submitResponse`. Insert the response with `original_text` only and `refined_text: null`.
- Render `r.original_text` directly on sticky notes (no more `refined_text || original_text` fallback).
- After loading responses, fetch `cocreation_participants` (id + display_name) for the session and build an `id -> name` map. Show the author name as a small label at the top of each sticky note (e.g. `— Panda7`).
- When inserting a new participant, if a name collision exists in the same session, regenerate with a numeric suffix until unique (best-effort using a quick `select display_name` lookup).

### 3. `src/pages/projects/co-creation/CoCreationDashboard.tsx` (host view)
- Mirror the same change: show `original_text` instead of `refined_text` so host and public stay consistent.
- Show participant display name above each response.

### 4. Edge function `supabase/functions/cocreation-refine-response`
- Leave the function deployed (other flows may rely on it) but it will no longer be called from the public page. No code change required.

## Out of scope
- No DB schema changes. `refined_text` column stays (nullable) for backward compatibility with existing rows.
- Synthesis flow (`cocreation-synthesize`) keeps working off `original_text`, which is already the primary signal.
