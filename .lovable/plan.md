## Why the images look "zoomed in"

On `src/pages/Dashboard.tsx`, the quick-link cards render their images inside a fixed `aspect-[4/3]` box with `object-cover`:

```tsx
<div className="aspect-[4/3] relative overflow-hidden">
  <img className="object-cover w-full h-full ..." />
</div>
```

The grid is `md:grid-cols-2 lg:grid-cols-4`. At your current 981px viewport you're in the `md` breakpoint, so each card is roughly half the screen wide. A half-width card with a 4:3 ratio becomes very tall, and `object-cover` then crops the source illustration heavily — which is exactly what the screenshot shows: just a slice of the pink circle / yellow shape on the left card and a slice of the template mock on the right card.

The source images themselves are fine; they're square-ish illustrations meant to be seen in full. `object-cover` + an oversized container is what's chopping them up.

## Fix

In `src/pages/Dashboard.tsx`:

1. Change the image container so it stays a sensible size at every breakpoint and the full illustration is visible.
   - Replace `aspect-[4/3]` with `aspect-video` (16:9) so cards aren't excessively tall when only 2 fit per row.
   - Replace `object-cover` with `object-contain` and add a soft background (`bg-muted`) so the illustration is shown whole, with neutral padding around it instead of being cropped.
2. Keep `thumbUrl(..., { width: 600 })`, lazy loading, and the hover scale effect — those aren't the problem.

No other files need to change. This is a pure presentation tweak on the dashboard cards.

### Before / after (conceptual)

```text
before:  [aspect-4/3] + object-cover  →  tall box, image cropped to fill
after:   [aspect-video] + object-contain + bg-muted  →  shorter box, full illustration with neutral padding
```

After the change, the pink/yellow course card and the template card should each show their full artwork instead of a zoomed-in corner.