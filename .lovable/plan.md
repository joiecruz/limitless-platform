## Goal

Rework the public participant page (`/cocreate/:slug`) so it feels like a Padlet/sticky-note board, with one question shown at a time, a clear progress indicator, and a floating "+" button for adding ideas. Confirm the page is truly public (no Lovable auth wall) and hide the "Edit with Lovable" badge from published deployments.

## Changes

### 1. Rewrite `src/pages/projects/co-creation/CoCreationPublic.tsx`

**Layout (one-question-at-a-time)**
- Replace the long stack of question cards with a single active question view.
- Local state `currentIndex` (0…questions.length-1) drives which question is shown.
- In **Event Mode**, `currentIndex` is forced to follow `session.active_question_id` (host controls the room).
- In **non-event mode**, participant navigates freely with **Prev / Next** buttons at the bottom.

**Progress indicator (top, under header)**
- Linear progress bar: `value = ((currentIndex + 1) / questions.length) * 100` using existing `Progress` component (`@/components/ui/progress`).
- Caption: `Question {currentIndex + 1} of {questions.length}` plus phase badge if present.

**Sticky-note board**
- Render responses for the current question as a responsive masonry-ish grid (`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3`).
- Each "note": rounded-lg card, soft pastel background (rotate through 5 token-based hues derived from `r.id` hash), slight rotation (`-rotate-1` / `rotate-1`), shadow, padding, body text, and a small footer with anonymous display name + upvote button (heart/▲). Reuse existing upvote logic.
- Empty state: dashed outline tile saying "Be the first to share an idea."

**Floating Add button**
- Fixed `+` button bottom-right (`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg`), only visible when `canSubmit` is true.
- Clicking opens a Dialog (`@/components/ui/dialog`) titled "Share an idea" with the `Textarea`, char counter, Cancel and Submit buttons. Reuses the current `submitResponse` flow (still calls `cocreation-refine-response` edge function in background).
- After submit, dialog closes and the new note animates onto the board (rely on realtime subscription already in place).

**Header simplification**
- Keep small header: Sparkles icon + "Co-Creation" + `You: {displayName}` badge. No Lovable branding anywhere.
- Title + description shown above progress bar.

### 2. Hide Lovable badge on published site

- Call `publish_settings--set_badge_visibility` with `hide_badge: true` so the published participant link has no "Edit with Lovable" pill. (This is what the user means by "no Lovable trace".)

### 3. Confirm public access (no auth required)

- Route is already outside `RequireAuth` in `AppRoutes.tsx` (`/cocreate/:slug`).
- Sanity-check the RLS policies on `cocreation_sessions`, `cocreation_questions`, `cocreation_participants`, `cocreation_responses`, `cocreation_upvotes` allow anonymous SELECT/INSERT for live sessions. If any policy still requires `auth.uid()` we will adjust it in a follow-up migration; from the prior migration this should already be the case, but we'll verify by reading the migration file before shipping.

### 4. Out of scope

- No changes to the host dashboard, edge functions, or DB schema.
- Anonymous identity (`getOrCreateAnonIdentity`) keeps working as-is.

## Technical notes

- New imports in `CoCreationPublic.tsx`: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` from `@/components/ui/dialog`; `Progress` from `@/components/ui/progress`; `Plus`, `Heart` from `lucide-react`.
- Sticky-note color palette uses Tailwind tokens already in the design system (e.g., `bg-yellow-100`, `bg-pink-100`, `bg-blue-100`, `bg-green-100`, `bg-purple-100`) — picked deterministically from `r.id.charCodeAt(0) % 5` so notes don't reshuffle on re-render.
- Event-mode sync: `useEffect` watching `session.active_question_id` updates `currentIndex` to match the host's active question.
- Locked / inactive states: when `canSubmit` is false, FAB is hidden and an inline notice ("Waiting for host to activate this question." / "Locked by host.") replaces the empty CTA.
