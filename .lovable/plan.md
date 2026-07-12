# Plan: Book a Free Consultation Flow

## 1. New page: `/book-consultation`

Create `src/pages/BookConsultation.tsx` with a well-designed two-column layout:

**Left panel (value prop)**
- Heading: "Book a free consultation"
- Sub: "30 minutes with a Limitless Lab strategist to map your next step with human-centered AI."
- 3 bullet reassurances: personalized to your context, no obligation, actionable next steps.
- Small testimonial or logo strip (reuse existing logos if easy).

**Right panel (form card)** — single form, one column, clean spacing, uses shadcn `Input`, `Select`, `Textarea`, `Label`, `Button`, with `zod` validation (mirroring `LeadCaptureForm.tsx` pattern) and `sonner` toast on success.

Fields:
1. Full name *
2. Work email *
3. Organization *
4. Role / job title *
5. **I am a…** (Select, required) — Business Owner / Entrepreneur, Corporate Professional, Government / Public Sector, Educator / School Leader, Student, Nonprofit / Development Org, Other
6. **Industry** (Select, required) — Technology, Financial Services, Healthcare, Education, Government / Public Sector, Retail / E-commerce, Manufacturing, Professional Services, Nonprofit / NGO, Media & Creative, Other
7. **Company size** (Select) — Just me, 2–10, 11–50, 51–200, 201–1000, 1000+
8. **What are you looking for?** (multi-select chips, at least one required) — options grounded in Limitless Lab offerings:
   - AI literacy & upskilling training
   - Leadership & team AI workshops
   - Custom in-house training program
   - AI readiness assessment for our team
   - Innovation / design thinking sprint
   - Strategy & roadmap consultation
   - Program partnership (LimitlessGov, AI Ready ASEAN, etc.)
   - Something else
9. **Preferred timeline** (Select) — This month, Next 1–3 months, Exploring for later
10. **Anything else we should know?** (Textarea, optional, max 1000 chars)
11. Consent line (auto-shown, not a checkbox): "By submitting you agree to be contacted by Limitless Lab."

Submit behavior: insert into a new `consultation_requests` table via Supabase (anon insert allowed, admin read only) and show success state ("Thanks — we'll be in touch within 1 business day") with a "Return home" button. Same RLS pattern used for `ati_leads`.

## 2. Database

New migration adds `public.consultation_requests` with columns for every field above plus `created_at`, standard GRANTs (`INSERT` to `anon`+`authenticated`, `SELECT` to superadmin only via `has_role`), RLS enabled, insert policy `true`, select policy restricted to superadmins.

## 3. Repoint CTAs

Replace every "Take Free AI Assessment" / "Get your score" → "Book a Free Consultation" navigating to `/book-consultation`:
- `src/pages/AIHomepage.tsx` line 89–93 (hero button)
- `src/components/ai-homepage/AINav.tsx` desktop CTA (~line 450) and mobile CTA (~line 562)
- `src/components/draft-home/AIReadinessSection.tsx` both card buttons

Leave `/ati` route and page files in place for now (unused), so nothing else breaks. Remove `/ati` from `public/sitemap.xml` and `scripts/generate-sitemap.ts` so the assessment isn't advertised. Add `/book-consultation` to both.

## 4. Footer main CTA

In `src/components/site-config/Footer.tsx`, replace the newsletter block in the first footer column with a Book-a-Free-Consultation card (heading, one-line pitch, primary button linking to `/book-consultation`). Newsletter subscribe form is removed from the footer as part of this change.

## 5. Routing & SEO

- Register `<Route path="/book-consultation" element={<BookConsultation />} />` in `src/routes/AppRoutes.tsx`.
- Add Helmet tags on the new page (title, description, canonical, og).

## Technical notes

- Form validation with `zod` + local `useState`, mirroring `LeadCaptureForm.tsx`.
- Multi-select "What are you looking for?" implemented as toggle chips (buttons with `aria-pressed`), not checkboxes, per project preference `mem://ui/signup-step-goals-toggle-pattern`.
- All colors via existing tokens / brand hex `#393CA0` already used across the codebase — no new tokens needed.
- Not touching `/ati` page contents, edge functions, or unrelated logic.
