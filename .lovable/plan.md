## Replace persona illustrations on homepage

### 1. Upload 4 new persona images as Lovable assets
Create asset pointers from the uploaded files:
- `user-uploads://ENTREPRENEURS.png` → `src/assets/persona-entrepreneur.png.asset.json` (overwrite)
- `user-uploads://CORPORATE.png` → `src/assets/persona-corporate.png.asset.json` (overwrite)
- `user-uploads://GOVERNMENT.png` → `src/assets/persona-public-servant.png.asset.json` (overwrite)
- `user-uploads://EDUCATOR.png` → `src/assets/persona-educator.png.asset.json` (overwrite)

The existing imports in `src/pages/AIHomepage.tsx` and `src/components/ati/data/personas.ts` pick up the new URLs automatically — no import changes needed.

### 2. Adjust persona card in `src/pages/AIHomepage.tsx` (People We Help Evolve section)
The uploaded images are roughly square (≈1100×900) with the subject cropped at chest/shoulders and touching the bottom edge — no transparent padding to work around. Change the card so the image sits flush at the bottom edge of the card:

- Remove fixed `h-[360px]` on the card and the `h-[220px]` image frame; let the card size to content.
- Title block: keep `px-6 pt-6 pb-4`.
- Image frame: full width, `aspect-[11/9]` (matches uploads), `overflow-hidden`, image as `w-full h-full object-cover object-bottom` with no `scale-110` — bottom of illustration aligns with bottom of card.
- Keep the border, rounded-2xl, and hover color treatment.

Result: all 4 cards are the same height (driven by the aspect ratio + title), and each illustration's bottom edge meets the card's bottom edge cleanly.

### Out of scope
- ATI persona intake (`PersonaIntake.tsx`) will inherit the new image URLs but keep its current framing; no layout change there unless you ask.
- No copy, nav, or other section changes.
