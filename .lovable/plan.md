## Plan

### 1. Replace persona images
- Upload the attached `Educator-b.jpeg` as the new `persona-educator` asset, replacing the existing `src/assets/persona-educator.png.asset.json`.
- Wait for the Student illustration upload in the next message, then replace `src/assets/persona-student.png.asset.json` the same way.

### 2. Restyle ATI persona cards (`src/components/ati/PersonaIntake.tsx`)
Rewrite each card to mirror the homepage "People we help evolve" tiles exactly:
- Fixed height `h-[360px]`, `bg-white border border-gray-200 rounded-2xl overflow-hidden`, flex column.
- Title at top in serif (`font-family: "Times New Roman MT Condensed Bold", ...`), `text-2xl sm:text-[1.6rem] font-bold`, `px-6 pt-6 pb-2`, color shifting to `#393CA0` on hover/active.
- Illustration anchored to bottom: `flex-1 flex items-end justify-center overflow-hidden`, `<img class="w-full h-full object-contain object-bottom">` with per-persona `imageClass` tweaks (scale/offset) matching the homepage values where applicable, and sensible defaults for the new Student and Educator artwork.
- Hover state: border turns `#393CA0` (matching homepage). Active/selected: same purple border + the existing check badge in the top-right corner.
- Grid stays `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` so the 5 personas wrap cleanly; the short description text is removed (homepage cards are image + title only).

No changes to scoring, routing, context-question step, or the rest of the ATI flow.
