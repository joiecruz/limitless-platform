## Plan: Replace Student Persona Image

### Context
The previous plan to restyle ATI persona cards and replace the Educator/Student images was approved. The Educator image has already been swapped. The user just uploaded the new Student illustration (`Student.png`). This plan covers the final remaining step.

### Step 1: Upload Student illustration to CDN
- Use `lovable-assets create` to upload `user-uploads://Student.png` as the new `persona-student` asset.
- Write the CLI output to `src/assets/persona-student.png.asset.json`, replacing the existing pointer.

### Step 2: Verify in preview
- Confirm the `/ati` route shows the new Student illustration in the persona card grid with the correct styling (homepage-matched cards, bottom-anchored image, serif title).

No other file edits are needed — `src/components/ati/data/personas.ts` already imports `persona-student.png.asset.json` by pointer, so updating the asset JSON automatically updates the image URL.