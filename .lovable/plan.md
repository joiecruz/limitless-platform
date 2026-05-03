## Why the QR returns 404

- DNS/hosting is fine: `https://www.limitlesslab.org/cocreate/<slug>` returns HTTP 200 (SPA shell), and the session row exists in `cocreation_sessions` with `status=live` and the matching slug.
- The 404 you see is the in‑app `NotFound` page. The `/cocreate/:slug` route was added to `src/routes/AppRoutes.tsx` but the **published** build on `limitlesslab.org` does not include it yet. Frontend changes only go live after clicking **Publish → Update**.

## Plan

1. **Republish the app**
   - Click Publish → Update in Lovable so the new `/cocreate/:slug` route ships to `limitlesslab.org`.
   - This alone resolves the QR 404.

2. **Harden `CoCreationPublic` 404 UX** (`src/pages/projects/co-creation/CoCreationPublic.tsx`)
   - When `notFound === true`, render a friendly branded "Session not available" screen with the Limitless Lab logo instead of the generic look, so a mistyped/expired slug never feels like a broken site.
   - Keep the existing fetch by `slug` (already uses `maybeSingle` and sets `notFound`).

3. **Confirm route placement** (`src/routes/AppRoutes.tsx`)
   - Verify `/cocreate/:slug` is registered before any catch‑all `*` / `NotFound` route and outside the `isAppSubdomain()` gate (it already is at line 136, but I'll re‑check the bottom of the file for the catch‑all order).

4. **Re-run the existing smoke test**
   - `bunx vitest run src/test/cocreate-public.smoke.test.ts` after publish to confirm 200 + no auth redirect on the live slug.

## Technical notes

- No DB / RLS changes needed — `cocreation_sessions` is already readable by the anon key (verified by smoke test).
- No domain/DNS work needed — `www.limitlesslab.org` already serves the SPA shell with status 200.
- Root cause is purely "published build is older than source"; steps 2–4 are quality hardening so this failure mode is obvious next time.
