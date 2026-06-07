## Why you're over the limit

Supabase counts **each unique image transformation** (a unique combination of source image + width/height/quality/resize params) against the **100 transformations/month** included in your plan. Once an image is transformed and CDN-cached it doesn't re-count, but every *new* variant does.

In this codebase, transformations are produced by `src/lib/imageUrl.ts` (`thumbUrl()`), which rewrites Supabase Storage URLs to the `/storage/v1/render/image/public/` endpoint. It's called from many high-traffic pages:

- `src/pages/Index.tsx` — hero (width 1600)
- `src/pages/Dashboard.tsx` — quick-link tiles (width 600, one per dashboard card)
- `src/pages/About.tsx` — about photo (width 1200)
- `src/pages/landing/Product.tsx` — 4+ product images (width 1200)
- `src/pages/landing/Services.tsx` — services hero (width 1200)
- `src/pages/landing/Courses.tsx` — course cards (width 800, one per course)
- `src/pages/landing/Tools.tsx` — tool cards (width 800, one per tool)
- `src/pages/landing/WorkshopDetail.tsx` — workshop image (width 1200)

Every time a new course/tool/workshop image is uploaded (or an admin replaces one), a fresh transformation is generated. With dozens of catalog items each rendered at a specific width, you blow past 100/month quickly. Your actual storage size (8 GB / 100 GB) and egress (<1 GB / 250 GB) are both fine — **the transformation quota is the only problem**.

## Recommendation

Drop on-the-fly Supabase transformations entirely. You're not on the egress edge, and originals are already reasonable in size, so the trade-off (slightly larger initial payload vs. paying for transformation overages or being throttled) is clearly in favor of dropping transforms.

## The plan

1. **Neutralize `thumbUrl`** in `src/lib/imageUrl.ts` so it returns the cleaned original URL and ignores width/quality/resize. This is a one-line change — every existing caller keeps working with no further edits.
2. **Strip the `?t=...` cache-buster** from originals (already done in `thumbUrl`) so the Supabase CDN can cache them properly. Keep that behavior.
3. **Add `loading="lazy"` and `decoding="async"`** to any `<img>` that uses `thumbUrl` and isn't above-the-fold (Tools grid, Courses grid, Product mid-page images). The hero on `Index.tsx` stays eager + `fetchpriority="high"`.
4. **Guidance for admins (no code change)**: when uploading new course/tool/workshop covers, pre-resize to ~1200px wide and compress (TinyPNG / Squoosh) before upload. Keeps egress low without needing transforms.
5. **Optional follow-up (not in this plan)**: if you later want true responsive images without paying Supabase, we can put Cloudflare in front of the storage bucket and use Cloudflare Image Resizing — but only if egress becomes a problem.

## What I will NOT change

- No edits to OG/meta image URLs in `<OpenGraphTags>` — those use originals already.
- No edits to the storage bucket, RLS, or any backend config.
- No changes to upload pipelines or admin tools (just a note for the user).

## Expected outcome

- New transformations drop to **0/month** going forward.
- The 121/100 number will stop growing; it resets at the start of your next Supabase billing cycle.
- Page weight goes up slightly on catalog pages (course/tool cards). With current egress at 0.9 GB / 250 GB this is a non-issue.

## Technical detail

Single code change:

```ts
// src/lib/imageUrl.ts
export function thumbUrl(url: string | null | undefined, _opts: ThumbOptions | number = {}): string {
  if (!url) return "";
  return url.split("?")[0]; // strip cache-buster, return original
}
```

Then a sweep of the files listed above to add `loading="lazy" decoding="async"` to non-hero `<img>` tags that currently lack it.
