# Bandwidth & Performance Optimization Plan

A full sweep of every file would be huge and risky. This plan focuses on the **highest-bandwidth offenders** identified in the codebase (79 `select('*')` calls, 211 total queries, zero pagination) and ships them in 4 phases. Each phase is independently shippable.

## Findings

| Problem | Evidence |
|---|---|
| `select('*')` everywhere | 79 occurrences across 50 files |
| Zero pagination | 0 uses of `.range()` in codebase |
| Heavy landing pages | `Blog`, `Tools`, `Courses`, `CaseStudies` each load entire table |
| Admin pages fetch all rows | `AdminUsers` loads every profile, filters client-side |
| Client-side search on full datasets | `AdminUsers`, `Tools`, several admin tables |
| No debounce on search inputs | confirmed in admin tables |
| React Query already set up | `staleTime: 5min`, `refetchOnWindowFocus: false` ✅ already good |

## Phase 1 — Public landing pages (biggest cached-egress wins)

These pages are hit by anonymous traffic, so every byte multiplies.

**Files:**
- `src/pages/landing/Blog.tsx` — paginate articles (12/page), select only `id, slug, title, excerpt, cover_image, published_at, categories`
- `src/pages/landing/Tools.tsx` — paginate (12/page), select `id, name, slug, category, cover_image, short_description`. Move category filter server-side
- `src/pages/landing/Courses.tsx` — select `id, title, slug, image_url, short_description, duration, level`
- `src/pages/landing/CaseStudies.tsx` — paginate (9/page), trim columns
- `src/components/site-config/InfiniteLogos.tsx` / `useClientLogos.ts` — select only `id, name, logo_url`
- `src/components/site-config/TestimonialsSection.tsx` — limit 6, trim columns
- `src/components/site-config/WorkshopsSection.tsx` — select only card-level fields

**Pattern applied:**
```ts
.select('id, slug, title, excerpt, cover_image, published_at')
.eq('published', true)
.order('published_at', { ascending: false })
.range(page * 12, page * 12 + 11)
```

Add a `<LoadMoreButton />` shared component. Set React Query `staleTime: 10min` on public content.

## Phase 2 — Admin tables (largest authenticated payloads)

These tables today fetch every row and filter in the browser — they break at scale.

**Files:**
- `src/pages/admin/AdminUsers.tsx` — server-side search via `.or('email.ilike,first_name.ilike,last_name.ilike')`, paginate 25/page, select `id, email, first_name, last_name, is_admin, is_superadmin, created_at, last_active`
- `src/pages/admin/AdminWorkspaceDetails.tsx` — paginate members
- `src/pages/admin/AdminMasterTrainers.tsx` — paginate + select trim
- `src/pages/admin/courses/CourseDetails.tsx` + `tabs/CourseLessons.tsx` + `tabs/CourseSections.tsx` — drop `select('*')`, request only fields rendered
- `src/components/admin/tools/ToolsTable.tsx`, `admin/logos/LogosTable.tsx`, `admin/blog/EditBlog.tsx`, `admin/case-studies/EditCaseStudy.tsx` — column trim + pagination

**New shared utilities:**
- `src/hooks/useDebouncedValue.ts` — 400ms debounce hook for search inputs
- `src/components/common/DataTablePagination.tsx` — Prev / Next / page indicator
- `src/lib/queryGuards.ts` — `assertPaginated(query, { max: 100 })` dev-mode guard that throws if `.range()` / `.limit()` is missing

## Phase 3 — Authenticated app surfaces

**Files:**
- `src/pages/Lesson.tsx` — already uses React Query, just trim columns (3 `select('*')` calls)
- `src/pages/Lessons.tsx` — same
- `src/pages/Courses.tsx` — same
- `src/hooks/useWorkspaceMembersView.ts` — replace 3× `select('*')` with explicit field list (interface already defines them)
- `src/pages/AccountSettings.tsx` — trim profile select
- `src/hooks/useAdminAnalytics.ts` — DAU/WAU currently pulls every `sessions.user_id` row for the period. Replace with a SECURITY DEFINER SQL function `get_admin_analytics(filter text)` that returns counts only — drops payload from MBs to <1KB

**One database migration:** add `get_admin_analytics()` function (read-only, search_path=public).

## Phase 4 — AI-related flows + safeguards

**Files:**
- `src/hooks/useEmpathize.ts`, `useDefine.ts`, `useIdeate.ts`, `usePrototype.ts`, `useTest.ts`, `useImplement.ts`, `useMeasure.ts`, `useProjectBrief.ts` — these `select('*')` from `stage_contents` and feed content to AI. Add `selectAIContext()` helper that returns only `{ id, content, summary }` truncated to ~2000 chars per item, with a hard limit of 20 items per AI call
- `supabase/functions/*` (any function piping data to AI) — same trim at the edge

## Cross-cutting changes

1. **React Query defaults** in `src/App.tsx` — already good, but add `gcTime: 10 * 60_000` and per-resource overrides for static lists (`staleTime: 30min`)
2. **Image delivery** — add `?width=400&quality=70` Supabase image transform query string to all `storage/v1/object/public/...` URLs in card thumbnails (Blog, Tools, Courses, CaseStudies, Workshops, Logos). Centralize in `src/lib/imageUrl.ts`
3. **Debounce** all search inputs (admin tables, future search) via `useDebouncedValue`
4. **Dev-only logging** — small wrapper logs response size + duration to console when `import.meta.env.DEV`, so future regressions are visible

## What this plan does NOT do

- Does **not** touch every one of the 50 files with `select('*')` in this single change — the long tail (design-thinking pages, smaller hooks) becomes a follow-up after we confirm Phase 1+2 measurably reduce egress
- Does **not** add a polling-based realtime layer — current behavior already disables `refetchOnWindowFocus`
- Does **not** restructure auth or change RLS

## Expected impact

- Public landing pages: ~70-90% smaller responses (entire `articles`/`innovation_tools` table → 12 trimmed rows + image transforms)
- Admin tables: scales from "breaks at 1k rows" → "constant payload regardless of table size"
- Analytics hook: from O(sessions) bytes → ~500 bytes
- AI hooks: bounded payload regardless of project size

## Suggested ship order

1. Phase 1 (landing + public) — biggest cached-egress win, lowest risk
2. Phase 3 analytics function migration — single biggest authenticated payload drop
3. Phase 2 admin tables — needs UI changes, ship after pagination component exists
4. Phase 4 AI flows — needs careful prompt testing