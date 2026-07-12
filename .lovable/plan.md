## Changes

### 1. `src/components/draft-home/AIReadinessSection.tsx` — simplify final CTA
Replace the two-column layout (copy + For Individuals / For Organizations cards) with a single centered CTA inside the same gradient panel:
- Remove the "Free Assessment" badge and all AI Readiness Assessment copy.
- Remove both "For Individuals" and "For Organizations" cards.
- New centered content:
  - Heading: "Start with clarity. Know where you stand." (second line in `#66E6F5`)
  - Subcopy: short line inviting a conversation with a Limitless Lab strategist (no assessment mention).
  - Single primary button "Book a free consultation" → `/book-consultation`, centered.
- Container becomes `text-center max-w-3xl mx-auto`; drop the `grid lg:grid-cols-2` wrapper. Keep the gradient panel + decorative blobs.
- Remove now-unused `User`, `Building2` imports.

### 2. `src/pages/AIHomepage.tsx` — fix persona card image alignment
Currently each of the 4 persona cards uses a different ad-hoc class (`scale-[1.2] origin-top`, `-mt-14`, `-mt-10`), which is why the heads don't line up. Normalize so all four illustrations share the same frame and the head sits at a consistent vertical position:
- Give the image wrapper a fixed height (e.g. `h-[220px]`) instead of `flex-1`, so the title area is the same on every card regardless of image aspect ratio.
- Use `object-contain object-bottom` on every image with no per-card `scale`/`-mt` overrides. Remove the `imageClass` field from the persona array.
- Adjust the Educator+Student and Public Servant images specifically: because their source PNGs have more empty headroom, apply a uniform `scale-110 origin-bottom` on all four (or crop via `object-position`) so the heads land at roughly the same y-position as the Entrepreneur/Corporate cards.
- Keep card outer height `h-[360px]`, title block, hover state, and grid layout unchanged.

No other files change. No routing, data, or copy changes elsewhere.
