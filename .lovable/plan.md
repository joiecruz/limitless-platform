## Make AIHomepage the new site homepage

### 1. `src/routes/AppRoutes.tsx` — swap `/` to render AIHomepage
- Replace the `<Index />` element on the unauthenticated `/` route with `<AIHomepage />`.
- Keep auth/app-subdomain redirect logic unchanged (authed → `/dashboard`).
- Keep the `/ai-homepage` route in place as an alias so existing links still work.
- Keep the `Index` import and `src/pages/Index.tsx` file untouched (not deleted, just no longer routed to).

### 2. `scripts/generate-sitemap.ts` + `public/sitemap.xml`
- Remove `/ai-homepage` from the sitemap (avoid duplicate URL indexing now that `/` serves the same content).
- `/` remains. Regenerate `public/sitemap.xml`.

### 3. Canonical/SEO verification in `src/pages/AIHomepage.tsx`
- Confirm `<link rel="canonical">`, `og:url`, and JSON-LD `url` all point to `https://limitlesslab.org/` (already correct — verify only, no code change expected).

### Out of scope
- No deletion of `Index.tsx` or its assets.
- No copy, nav, footer, or persona-card code changes in this pass (image re-crop happens on your side; a follow-up can drop the `scale-110` override once new images are in).
