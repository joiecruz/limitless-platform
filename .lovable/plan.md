# Restore dashboard card images

## Problem
The three dashboard cards ("Explore online courses", "Access innovation templates", "Create your innovation project") currently render the illustration as a small contained image with large empty gray margins. This is caused by recent changes to the image container.

## Fix
Revert the image container in `src/pages/Dashboard.tsx` (around lines 108–112) to the original styling so illustrations fill the card edge-to-edge like in the reference screenshot.

### Change
- Aspect ratio: `aspect-[4/3]` → `aspect-video`
- Remove `bg-muted/40` background
- Remove `p-6` inner padding
- Image fit: `object-contain` → `object-cover`
- Keep: `thumbUrl(..., { width: 600 })`, `group-hover:scale-105`, `loading="lazy"`, rounded corners, overflow-hidden

### Result
Illustrations crop to fill the full card width in a 16:9 frame, matching the reference screenshot you shared. No other files change.

## Scope
- Single file: `src/pages/Dashboard.tsx`
- Presentation-only (Tailwind classes on the image wrapper + `<img>`); no logic, data, or routing changes.
