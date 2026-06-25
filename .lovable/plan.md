## What "Crawled – currently not indexed" means

Google fetched these 24 URLs but chose not to index them. It's a **quality/signal** verdict, not a technical block. The common causes on your site, based on the affected URLs:

1. **JS-rendered body content** — Googlebot sees a near-empty HTML shell for `/about`, `/tools/<uuid>`, `/blog/<slug>`. Even when it eventually renders JS, thin first-paint HTML lowers the quality score and Google often skips indexing.
2. **Duplicate/near-duplicate paginated URLs** — `/?23e08153_page=2` and `/blog?63ea258e_page=3` look like duplicates of `/` and `/blog` with no unique content or canonical pointing home.
3. **Auth pages crawled** — `/signin` has no value to index (we already disallow it in robots.txt, but Google had crawled it earlier).
4. **Tool/blog detail pages missing per-route canonical + unique meta** — many `/tools/<uuid>` and `/blog/<slug>` pages either lack distinct title/description in the static HTML, or canonicalize to the homepage.
5. **No sitemap entries for blog/tools** — our new sitemap only lists 13 marketing routes, so Google has no fresh signal that these detail pages are canonical & important.

## Plan

### A. Fix the indexing signals (SEO)

1. **Strip junk query params from canonicals**
   - In `OpenGraphTags` (both copies), force the canonical to `new URL(url).origin + pathname` so `?23e08153_page=2` style URLs collapse to the clean path.
   - Add `<meta name="robots" content="noindex">` on `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/invite`, `/dashboard/*`, `/admin/*` via Helmet.

2. **Per-route unique meta on detail pages**
   - Audit `BlogPost.tsx`, `ToolDetail.tsx`, `CaseStudy.tsx`, `CourseDetail.tsx`, `WorkshopDetail.tsx`: confirm each renders `<OpenGraphTags>` with the row's own title, excerpt/description, cover image, and a self-referencing canonical (no homepage fallback).

3. **Expand the sitemap with dynamic content**
   - Update `scripts/generate-sitemap.ts` to fetch published blog posts, tools, case studies, courses, and workshops from Supabase and append `{ path, lastmod }` entries.
   - Keeps `predev`/`prebuild` hooks; uses the public anon key.

4. **Add JSON-LD per content type**
   - `Article` schema on `BlogPost`, `Product`/`HowTo` on `ToolDetail`, `Course` on `CourseDetail`, `Event`/`Course` on `WorkshopDetail`, `BreadcrumbList` on detail pages.
   - `Organization` + `WebSite` (with `SearchAction`) sitewide in `index.html`.

5. **Improve crawlable first paint (the root cause)**
   - The real fix for "Googlebot sees empty HTML" is prerendering. Since we removed `react-snap`, propose a lightweight alternative: **`vite-plugin-prerender` (puppeteer-based, modern)** or **`vite-react-ssg`** to prerender the same 13 marketing routes at build time without the vulnerable `ws` dep. Detail page bodies stay JS-rendered (Google handles that fine when meta + canonicals are correct).

### B. Generative Engine Optimization (GEO — ChatGPT/Claude/Perplexity)

LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) mostly **don't execute JS**. They read the raw HTML once. To be cited:

1. **Allow them in `robots.txt`** — explicitly `Allow: /` for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `anthropic-ai`. (You can choose to block them instead if you don't want training use — confirm preference.)
2. **Ship `/llms.txt`** — you already have `public/llms.txt`; expand it to summarize Limitless Lab's offerings, programs, and key URLs in plain markdown (the emerging LLM-friendly index standard).
3. **Prerender marketing pages** (same as A.5) so LLM crawlers actually see your hero copy, program descriptions, and program features.
4. **Add FAQ/HowTo JSON-LD** on program pages — LLMs lean heavily on structured Q&A.
5. **Author-attributed content** — add `Person` schema + visible author bylines on blog posts (LLMs cite attributed content more).

### C. Clean up Search Console

- Submit updated `sitemap.xml` in GSC.
- For the affected 24 URLs: once canonicals are fixed, click **Validate Fix** in the GSC report (you've already started one — let it run).
- Use **URL Inspection → Request Indexing** for 5–10 high-value pages (homepage, each persona, each program, top 3 blog posts).

## Technical section

Files to touch:

- `src/components/OpenGraphTags.tsx` + `src/components/common/OpenGraphTags.tsx` — canonical normalization, optional `noIndex` prop.
- `src/pages/SignIn.tsx`, `SignUp.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `VerifyEmail.tsx`, `InvitePage.tsx`, `Dashboard.tsx`, `admin/*` — add `<Helmet><meta name="robots" content="noindex,nofollow"/></Helmet>`.
- `src/pages/BlogPost.tsx`, `landing/ToolDetail.tsx`, `pages/ToolDetails.tsx`, `landing/CourseDetail.tsx`, `landing/WorkshopDetail.tsx`, `CaseStudy.tsx` — verify/add per-row OG tags + JSON-LD.
- `scripts/generate-sitemap.ts` — fetch `articles`, `innovation_tools`, `case_studies`, `courses`, `workshops` via Supabase, append entries.
- `public/robots.txt` — add explicit LLM bot allow/deny blocks.
- `public/llms.txt` — expand content.
- `index.html` — add `Organization` + `WebSite` JSON-LD if not present.
- (Optional, with approval) add `vite-plugin-prerender` or `vite-react-ssg` for static prerendering of the 13 marketing routes.

## Decisions I need from you before building

1. **Prerendering** — Add `vite-plugin-prerender` (puppeteer-based, modern; no vulnerable `ws`) to statically render the 13 marketing routes at build? This is the single biggest fix for both Google indexing quality and LLM citation.
2. **LLM bots** — Allow (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`) to crawl & cite Limitless Lab content, or block them?
3. **Dynamic sitemap** — Include all published blog posts, tools, case studies, courses, workshops? (Recommended yes.)
