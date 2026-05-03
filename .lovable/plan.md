I found the immediate cause: the dashboard builds the participant URL from `window.location.origin`, so when the host is using the Lovable preview/admin URL, the QR code and copied link also point to Lovable. The project itself is already published publicly and the Lovable badge is already hidden.

Plan:

1. Use the custom domain for participant links
   - Add a small URL helper for co-creation participant links.
   - Generate links as `https://www.limitlesslab.org/cocreate/{slug}` instead of using the current preview/admin origin.
   - Update the QR code, link input, and copy button to use that custom-domain URL.

2. Preserve preview/local development behavior safely
   - In local or non-production environments, still allow a usable local/preview URL when needed for testing.
   - In the host dashboard UI, prefer the public custom domain so real event participants never see a Lovable URL.

3. Keep the participant route public
   - Confirm `/cocreate/:slug` remains outside the authenticated dashboard route.
   - Add/adjust route handling only if needed so opening the custom-domain co-creation link does not send unauthenticated participants to sign in.

4. Improve domain consistency
   - Since the app currently redirects `limitlesslab.org` to `www.limitlesslab.org`, use the `www` custom domain in generated links to avoid redirects and make QR scans cleaner.

5. Verify branding/access settings
   - Keep the published site visibility public.
   - Keep the Lovable badge hidden.
   - No `lovable.app` URL should appear in the participant link or QR code after the change.

Technical details:
- Main code change: `src/pages/projects/co-creation/CoCreationDashboard.tsx`, replacing `${window.location.origin}/cocreate/${session.slug}` with a custom-domain-aware helper.
- Likely helper location: `src/utils/domainHelpers.ts`, adding something like `getPublicSiteOrigin()` / `getCoCreationPublicUrl(slug)`.
- Existing public route is already defined at `src/routes/AppRoutes.tsx` as `/cocreate/:slug` outside `RequireAuth`, so the route should remain public unless we uncover an auth redirect issue during verification.