## Problem

The three dashboard quick-link cards ("Explore online courses", "Access innovation templates", "Create your innovation project") look broken:

- The illustration area is a wide 16:9 box (`aspect-video`) with `object-contain` on a muted background.
- The source images in `web-assets` are **tall, near-square UI-mockup illustrations** (browser window with colorful content in the top portion and lots of empty space below).
- Result: `object-contain` scales the image to fit the short height of the box → image becomes small and centered with awkward grey letterboxing on the sides, and what's shown looks "cropped at the top of a mockup".

The previous edit (switching from `object-cover` + `aspect-[4/3]` to `object-contain` + `aspect-video`) made it worse, not better, because the source illustrations don't match a 16:9 frame.

## Fix

In `src/pages/Dashboard.tsx`, restyle the image container (lines 108-117) so the illustrations are presented as deliberate, full-bleed artwork:

1. Change the container from `aspect-video` to `aspect-[4/3]` — closer to the natural ratio of these mockup illustrations, so far less empty space.
2. Keep `object-contain` so the full illustration is always visible (no cropping of the colorful part).
3. Add inner padding (`p-6`) and a soft branded background (`bg-muted/40`) so the illustration sits inside a calm "frame" instead of floating awkwardly.
4. Keep `group-hover:scale-105`, `loading="lazy"`, and `thumbUrl(..., { width: 600 })` — these aren't the problem.

No other files need to change. Pure presentation tweak.

## Technical details

Replace the image block:

```text
<div className="aspect-video relative overflow-hidden bg-muted">
  <img
    src={thumbUrl(link.image, { width: 600 })}
    alt={link.title}
    className="object-contain w-full h-full group-hover:scale-105 ..."
    ...
  />
</div>
```

with:

```text
<div className="aspect-[4/3] relative overflow-hidden bg-muted/40 p-6">
  <img
    src={thumbUrl(link.image, { width: 600 })}
    alt={link.title}
    className="object-contain w-full h-full group-hover:scale-105 ..."
    ...
  />
</div>
```

After the change I'll screenshot the dashboard at the current viewport (~1091px, 3-up grid) and at the `md` breakpoint (2-up) to confirm the illustrations sit nicely with no awkward cropping or excessive letterboxing.
