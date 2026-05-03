# Visual Summary: Inline Display, History, and Faithful Prompt

## Problem

1. Generated visuals already exist in `cocreation_outputs` (confirmed two rows for this session, including a valid public image URL), but the dashboard isn't reliably surfacing them — only the very latest is fetched, with no list/history, no regenerate affordance, and no clear empty/error state.
2. The current image prompt instructs the model to add icons, mini-scenes, doodles (lightbulbs, hearts, plants, people) and "illustrate" the themes. This causes the model to invent content not present in the synthesis.
3. When synthesis is missing for some questions (as in the most recent run), the prompt feeds the model raw responses or empty sections, so the image fills in gaps creatively.

## Where Outputs Are Stored

- File: `cocreation-outputs` storage bucket (public), path `{session_id}/visual-{timestamp}.png`
- Row: `cocreation_outputs` table — `kind = 'visual'`, `content = { image_url, prompt }`, `created_at`

## Changes

### 1. Dashboard UI — Visual Summary panel (`CoCreationDashboard.tsx`)

Replace the single "latest visual" preview with a proper output panel inside the existing "Generate outputs" card:

- **Current view** at the top: the most recent visual rendered large, with:
  - Primary action: "Regenerate" (calls the same edge function; shows spinner + toast)
  - Secondary actions: "Download" and "Open in new tab"
  - Timestamp ("Generated 3 min ago")
- **History strip** below: horizontal scroll of thumbnails of all prior visuals for this session, newest first. Click a thumbnail to make it the current view. Each thumbnail shows the timestamp on hover.
- **Empty state**: friendly card explaining what a visual summary is, with a single "Generate visual summary" CTA. Disabled until at least one synthesis row exists (visuals should reflect synthesized themes, not raw input).
- **Loading state**: skeleton in the current-view slot + disabled buttons + toast about 20–40s wait.
- **Error state**: inline alert with retry button.

Data fetch change: load all `cocreation_outputs` for the session where `kind = 'visual'`, ordered desc, into local state. Append the new row when generation succeeds (no full reload needed). Keep the existing realtime channel; add a subscription on `cocreation_outputs` filtered by `session_id` so multiple hosts see new generations live.

### 2. Tighten the AI prompt (`supabase/functions/cocreation-generate-output/index.ts`)

Goals: faithful to synthesis, no invented content, still visually appealing in the user's reference style.

- **Refuse to generate when there is no synthesis.** Return a 400 with a clear message ("Run synthesis first — the visual summary illustrates the synthesized themes."). Today the function silently falls back to raw responses; that's where most of the "overcompensation" comes from.
- **Build the content payload from synthesis only**, structured as a strict outline:
  - Workshop title (verbatim from session)
  - Per question: question text + bulleted theme `label: insight` pairs (verbatim)
- **Rewrite the prompt** to:
  - Describe the visual *style* only (sketch-noted poster, hand lettering, watercolor washes in teal/orange/mustard on off-white, sketchy connecting lines).
  - Explicitly instruct: "Render ONLY the title, question headings, and theme labels/insights provided below. Do not invent additional themes, statistics, names, quotes, or examples. Do not add captions or text that are not in the provided content. Decorative doodles are allowed only as small neutral marks (dots, arrows, underlines) — no representational icons (people, lightbulbs, plants, hearts, etc.) unless a theme label explicitly references them."
  - Require all rendered text to match the provided strings exactly (spelling and wording).
  - Single landscape poster, legible hand-lettering.
- Keep storing the exact prompt in `content.prompt` for traceability.

### 3. Minor robustness

- After successful upload, return the new row id and `created_at` so the UI can append without refetch.
- Add `session_id` filter index check is unnecessary (small table); skip.

## Out of Scope

- Slides and Podcast digest stay disabled ("Coming soon").
- No deletion of past outputs in this iteration (history is read-only).
- No changes to synthesis logic.

## Files Touched

- `src/pages/projects/co-creation/CoCreationDashboard.tsx` — new visual panel with history, regenerate, empty/loading/error states, realtime on `cocreation_outputs`.
- `supabase/functions/cocreation-generate-output/index.ts` — require synthesis, rebuild structured content payload, rewrite prompt to forbid invention, return new row metadata.

No database migrations needed.
