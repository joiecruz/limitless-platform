# Reduce Supabase Cached Egress (41 GB → <5 GB)

## Where the bytes actually come from

I inspected the storage buckets and public-page code. Egress is dominated by **video and image bytes**, not JSON. Recent query trimming work has already eliminated most `select('*')` waste; the remaining wins are in assets and caching.

| Bucket | Files | Size | Notes |
|---|---|---|---|
| `aim-asean-modules` | 29 | **6.6 GB** of MP4 | many 200–535 MB videos served from public bucket |
| `master-trainer-reports` | 481 | 557 MB | not public, fine |
| `course-lessons` | 8 | 257 MB | MP4s |
| `limitless-gov-lessons` | 1 | 174 MB | one 174 MB MP4 |
| `blog-covers` | 61 | 62 MB | several 4–9 MB JPGs/PNGs served full-size |
| `web-assets` | 60 | 16 MB | hero PNG re-downloaded repeatedly |

Plus on the public homepage and listings:
- The hero PNG (`Hero_section_image.png?t=...`) is loaded raw, with a cache-busting `?t=` query that defeats CDN caching.
- `BlogSection`, `Features`, `InfiniteLogos`, `Product.tsx`, `About.tsx`, `Privacy/Terms/NotFound`, `OpenGraphTags` all reference original `/storage/v1/object/public/...` URLs (no `thumbUrl`, no `loading="lazy"`, no `width/height`).
- `WorkshopDetail`, `CourseDetail` render `image_url` at full resolution.

A single homepage visit currently pulls ~3–5 MB of images. With the AIM ASEAN videos served from public Supabase Storage, even a handful of learners replays = tens of GB.

## What we will change (no design changes)

### 1. Stop serving large videos directly from Supabase egress
This is the single biggest line item.

- Add a cheap `videoUrl()` helper that returns the storage URL **as-is for now** but marks where every `<video>` source comes from.
- For `aim-asean-modules`, `course-lessons`, `limitless-gov-lessons`: in `VideoPlayer.tsx`, set `preload="metadata"` (currently videos may auto-preload), and ensure no listing page renders `<video>` thumbnails — only the actual lesson page mounts a player.
- Document (in README) that long-form video should move to YouTube/Mux/Cloudflare Stream. The player already supports YouTube — recommend re-uploading the AIM ASEAN catalogue to an unlisted YouTube channel and pasting URLs into existing `video_url` fields. **No code change needed beyond enabling that path; this alone removes ~6 GB/month of repeated egress.**

### 2. Route every public image through `thumbUrl()`
`src/lib/imageUrl.ts` already exists but is only used on 4 listing pages. Extend it everywhere a Supabase image is rendered on a public page.

Files to update with `thumbUrl(url, { width: N })` + `loading="lazy"` + explicit `width`/`height`:

| File | Image | Width preset |
|---|---|---|
| `src/pages/Index.tsx` (hero) | Hero PNG | 1600, drop the `?t=` cache-buster, `fetchpriority="high"` |
| `src/components/site-config/BlogSection.tsx` | `cover_image` | 600 |
| `src/components/site-config/Features.tsx` | feature images | 800 |
| `src/components/site-config/InfiniteLogos.tsx` | logos | 240 |
| `src/components/site-config/FeatureSection.tsx` | image | 800 |
| `src/components/site-config/TestimonialsSection.tsx` | `photo_url` | 200 |
| `src/components/services/CoDesignProcess.tsx` | diagram | 1200 |
| `src/components/projects/ProjectBanner.tsx` | banner | 1200 |
| `src/pages/About.tsx` | hero | 1200 |
| `src/pages/landing/Product.tsx` | 4 product images | 1200 |
| `src/pages/landing/Services.tsx` | services image | 1200 |
| `src/pages/landing/CourseDetail.tsx` | `image_url` | 1200 |
| `src/pages/landing/WorkshopDetail.tsx` | `image_url` | 1200 |
| `src/pages/CaseStudy.tsx`, `BlogPost.tsx`, `ToolDetails.tsx` | covers | 1200 |
| `OpenGraphTags` defaults | hero | 1200 |
| `src/pages/Dashboard.tsx` (3 quick-link cards) | promo | 600 |

`thumbUrl` already adds `quality=70` and uses Supabase's `/render/image/public/` endpoint so the CDN serves a much smaller derivative (typical 4 MB PNG → ~80 KB WEBP-equivalent).

### 3. Cache-buster cleanup
Strip `?t=2024-...` from the hero URL in `Index.tsx`, `BlogPost.tsx`, `CaseStudy.tsx`, `Privacy.tsx`, `Terms.tsx`, `NotFound.tsx`, `Tools.tsx`, `Blog.tsx`, `CaseStudies.tsx`, `Courses.tsx`, `WorkshopDetail.tsx`, `Services.tsx`, `Product.tsx`, `OpenGraphTags`. The `?t=` defeats the Supabase CDN cache and forces revalidation on every load.

### 4. Lock in client-side caching on public queries
Most public hooks call `useQuery` without `staleTime`, so React Query refetches on every navigation/focus. Add long `staleTime` + `gcTime` to:

- `Index.tsx` session check (already 5 min — keep)
- `BlogSection`, `WorkshopsSection`, `TestimonialsSection`, `useClientLogos` → `staleTime: 30 * 60_000`
- `landing/Blog.tsx`, `landing/CaseStudies.tsx`, `landing/Tools.tsx`, `landing/Courses.tsx` → `staleTime: 10 * 60_000`, `refetchOnWindowFocus: false`
- Detail pages (`BlogPost`, `CaseStudy`, `CourseDetail`, `ToolDetail`, `WorkshopDetail`) → `staleTime: 15 * 60_000`

Also set sensible global defaults in `src/main.tsx` `QueryClient`:
```ts
defaultOptions: { queries: {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
}}
```

### 5. Compress the worst storage offenders (one-off)
Top blog covers are 4–9 MB. Even after `thumbUrl`, the original is still served once when an editor opens the dashboard. Add a short script note in the plan deliverable; no automatic re-upload (out of scope), but flag the 5 worst offenders to the team.

### 6. Pagination / list-page guards
Already done in the previous pass. Spot-fix only:
- `landing/Tools.tsx` — confirm `.range()` + Load more is in place.
- `BlogSection` (homepage) — already `.limit(3)`. Good.

### 7. Dev-only diagnostics
Add a tiny `src/lib/egressLogger.ts` that, when `import.meta.env.DEV`, wraps `supabase.from(...).select(...)` calls via a thin proxy and `console.debug`s the table + approximate response size from `JSON.stringify(data).length`. Off in production. Helps the team spot regressions without affecting users.

## Files to create / edit

**Create**
- `src/lib/egressLogger.ts` (dev-only)

**Edit (asset/caching changes only — no UI changes)**
- `src/main.tsx` — QueryClient defaults
- `src/pages/Index.tsx`, `Dashboard.tsx`, `About.tsx`, `BlogPost.tsx`, `CaseStudy.tsx`, `ToolDetails.tsx`, `Privacy.tsx`, `Terms.tsx`, `NotFound.tsx`
- `src/pages/landing/Product.tsx`, `Services.tsx`, `CourseDetail.tsx`, `WorkshopDetail.tsx`, `Blog.tsx`, `CaseStudies.tsx`, `Courses.tsx`, `Tools.tsx`
- `src/components/site-config/BlogSection.tsx`, `Features.tsx`, `FeatureSection.tsx`, `InfiniteLogos.tsx`, `TestimonialsSection.tsx`, `WorkshopsSection.tsx`
- `src/components/site-config/hooks/useClientLogos.ts`
- `src/components/services/CoDesignProcess.tsx`
- `src/components/projects/ProjectBanner.tsx`
- `src/components/OpenGraphTags.tsx`
- `src/components/lessons/VideoPlayer.tsx` — `preload="metadata"`

## Expected impact
- Hero/listing image bytes per page: **~4 MB → ~150 KB** (~25× smaller, served WEBP from Supabase render endpoint).
- Removing the `?t=` cache-buster lets the CDN actually cache; repeat visits drop to **0 KB** for the hero.
- React Query `staleTime` removes most repeat JSON fetches across navigations.
- If AIM ASEAN videos move to YouTube (recommended, no code change beyond pasting URLs), **~6 GB of monthly egress disappears outright**.

Combined, this should land egress well under 5 GB/month while keeping every page visually identical.

## What I'm explicitly NOT doing
- No layout, copy, or component restructuring.
- No backend schema changes.
- No automatic re-upload of existing storage files (call-out only).
- No removal of Supabase Storage for non-video assets — `thumbUrl` makes them cheap enough.
