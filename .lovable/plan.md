## Fix zoomed-in dashboard card images

The reference screenshot shows illustrations being cropped (only partial pink arc, partial yellow shape, partial SDG wheel). This is because the image wrapper uses `object-cover` which crops to fill.

### Change
In `src/pages/Dashboard.tsx` (line 112), change `object-cover` → `object-contain` so the full illustration fits within the 16:9 frame without cropping or zooming.

Keep everything else: `aspect-video`, `group-hover:scale-105`, `loading="lazy"`, dimensions.

### Result
Each card shows the full illustration centered in the frame, no zoom/crop. Slight letterboxing may appear if the source image isn't 16:9, but nothing is cut off.

### Scope
Single-line presentation change in `src/pages/Dashboard.tsx`. No logic or data changes.
