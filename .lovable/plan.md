## Create a Homepage Variant

Create a duplicate of the current homepage (`src/pages/Index.tsx`) at a new route (`/ai-homepage`) with the following modifications:

### Hero Section Changes
- **Headline**: Change to "Grow beyond limits using human-centered AI."
- **Styling**: The phrase "human-centered AI" should be:
  - Serif font (`font-serif`)
  - Italicized (`italic`)
  - Purple (`text-purple-500` or similar purple shade)
- **Alignment**: Left-align the headline and subtext instead of center (`text-left`)
- **CTAs**: Replace the two existing buttons with:
  - "Learn More" — links to `/services`
  - "Take Free Assessment" — links to a relevant page (e.g., `/programs` or external)
- **Hero image**: Remove the large colorful hero image (`HERO_IMAGE`) entirely. Retain all other sections below (logos, features, blog, CTA, footer).

### New Files
- `src/pages/AIHomepage.tsx` — the new page component

### Modified Files
- `src/routes/AppRoutes.tsx` — add route `/ai-homepage` → `AIHomepage`

### Implementation Notes
- Copy `Index.tsx` as the base for `AIHomepage.tsx`.
- Remove the hero image preload from `<Helmet>` and the image markup.
- Adjust hero `div` classes from `text-center` to `text-left` and remove `mx-auto` constraints that center content.
- For the serif font, use Tailwind's `font-serif` (system serif stack) since no custom serif font is currently loaded.
- Keep all existing sections (InfiniteLogos, Features, BlogSection, CTASection, Footer) unchanged.