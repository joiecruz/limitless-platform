## Changes

### 1. Remove "Who We Help" from AI nav
In `src/components/ai-homepage/AINav.tsx`:
- Remove the desktop "Who We Help" mega-menu trigger + dropdown (around line 374).
- Remove the mobile "Who We Help" collapsible section (around line 529).
- Leave the rest of the nav (logo, other menus, CTAs) untouched so it can be re-added later.

### 2. Use persona images instead of icons on `/ati`
The four persona images already exist in `src/assets/`:
- `persona-corporate.png`
- `persona-educator.png`
- `persona-entrepreneur.png`
- `persona-public-servant.png`

There's no existing image for the **Student** persona, so I'll generate one (`src/assets/persona-student.png`) in the same illustrated style as the others.

In `src/components/ati/data/personas.ts`:
- Add an `image: string` field to each persona, importing the five assets. Keep `icon` available in case it's reused elsewhere (or drop it if unused — I'll check usages and remove if safe).

In `src/components/ati/PersonaIntake.tsx`:
- Replace the rounded icon tile with a square/rounded image thumbnail at the top of each card (e.g. `aspect-[4/3]` image, `rounded-xl object-cover`, with the persona name + description below).
- Keep the active-state styling (purple border, check badge) and hover lift.
- Keep grid responsive (1 / 2 / 3 columns) and the rest of the flow unchanged.

No backend, scoring, or routing changes.