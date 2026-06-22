## Plan: AI Homepage Hero Updates

### 1. Add Uploaded Hero Image to Right Side
- Upload `user-uploads://Limitless_Lab-hero.png` via Lovable Assets CDN (`lovable-assets create`).
- Refactor the hero section in `src/pages/AIHomepage.tsx` to a side-by-side layout:
  - Left column: existing headline, subhead, and CTAs.
  - Right side: the uploaded image, scaled up (~1.1x), positioned at the right edge of the viewport with a slight overlap past the container edge (`translate-x-[10%]` or negative right offset) so it feels integrated and larger.
- Use `relative` on the hero wrapper and absolute or flex positioning so the image can break out of the `max-w-7xl` container bounds on the right.

### 2. "human-centered AI" Typography Changes
- In the hero `<h1>` span, add `fontWeight: "bold"` to the existing inline `style` block.
- Increase the span’s size slightly via `text-[1.15em]` (or similar) so it stands out a bit more within the headline.
- Keep existing `italic`, `text-[#393CA0]`, and Times New Roman Condensed font family.

### Out of scope
- No changes to other pages, routes, or existing sections below the hero.
- No new components or design-system tokens.
