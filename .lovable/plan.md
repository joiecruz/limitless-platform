# Plan: Transformation Model + Partner Pages, Cleanup LimitlessBiz

## 1. New page — Transformation Model (`/about/transformation-model`)

A dedicated page explaining how Limitless Lab drives change. Content drafted from the existing About page pillars (Training, Co-Design, Product), the "Grow beyond limits with human-centered AI" positioning, and the AI Homepage belief sections.

Sections:
- **Hero** — "Our Transformation Model" + tagline: "How we help people, organizations, and ecosystems grow beyond limits."
- **The Limitless Approach** — short intro: we combine design thinking, AI, and systems thinking to deliver human-centered transformation.
- **Three Layers of Transformation**
  1. **Individual** — building mindsets and skills (training, coaching, certifications).
  2. **Organizational** — embedding innovation capability (co-design, AI adoption, internal labs).
  3. **Ecosystem** — scaling change across sectors and regions (programs like LimitlessGov, AI Ready ASEAN, AIM ASEAN).
- **Our Three Pillars** — reuse Training / Co-Design / Product cards from About.
- **Our Methodology** — Discover → Design → Develop → Deploy → Scale (5-step horizontal flow).
- **Guiding Principles** — human-centered, AI-enabled, evidence-based, locally rooted, regionally scaled.
- **CTA** — links to Partner page and Contact.

## 2. New page — Partner with Limitless Lab (`/about/partner`)

Sections:
- **Hero** — "Partner with Limitless Lab" + intro about co-creating impact across SEA.
- **Why Partner With Us** — proof points (8+ years, 13,000+ trained, ASEAN-wide reach, awards/recognition pulled from About timeline).
- **Ways to Partner** — card grid:
  - Program & Grant Partners (foundations, development orgs)
  - Government & Public Sector
  - Corporate & CSR Partners
  - Academic & Research Institutions
  - Community & Implementation Partners
- **What Partnership Looks Like** — co-design, co-funding, co-implementation, knowledge sharing.
- **Featured Partners** — logo strip (reuse `InfiniteLogos` component if available).
- **Partner Inquiry CTA** — primary button "Start a Conversation" → mailto or link to existing contact route; secondary "Download Partnership Deck" placeholder.

## 3. Connect to existing About page

In `src/pages/About.tsx`, after the "Our Impact" section, add a two-card "Learn More" block linking to:
- `/about/transformation-model`
- `/about/partner`

Also add a small inline link in the "What We Do" intro pointing to the Transformation Model page.

## 4. Navigation updates

`src/components/site-config/MainNav.tsx` — convert the existing About link into a dropdown (desktop + mobile collapsible) with:
- About Us → `/about`
- Our Transformation Model → `/about/transformation-model`
- Partner With Us → `/about/partner`

`src/components/site-config/Footer.tsx` — add the two new links under the About column.

## 5. Remove LimitlessBiz from Programs

- Delete the file `src/pages/programs/LimitlessBiz.tsx`.
- Remove the `LimitlessBizProgram` import and the `/limitlessbiz` route from `src/routes/AppRoutes.tsx`.
- Confirm `Programs.tsx` page and `MainNav` Programs dropdown contain no LimitlessBiz references (already clean — verified).
- Remove `/limitlessbiz` URL from `public/sitemap.xml` and `scripts/generate-sitemap.ts` if present.
- Leave the `LimitlessBizAvailableDialog` dashboard popup untouched unless you want it removed too (flag below).

## Technical notes

- Both new pages follow the existing pattern: `MainNav` + `OpenGraphTags` + content sections + `CTASection` + `Footer`, using semantic tokens (`text-foreground`, `bg-background`, `text-primary`) and Tailwind utilities consistent with `About.tsx` and `LimitlessGov.tsx`.
- Routes added inside the `!isAppSubdomain()` block in `AppRoutes.tsx`.
- SEO: each page gets a unique `<h1>`, meta title <60 chars, description <160 chars, canonical URL, and entry in `sitemap.xml` + `generate-sitemap.ts`.
- Use `usePageTitle` hook for tab titles.

## Open questions

1. Should the dashboard `LimitlessBizAvailableDialog` popup also be removed?
2. For the Partner page CTA, do you want a mailto link (which address?) or should it route to a new contact form?
3. Any specific partner logos to feature, or reuse the existing `InfiniteLogos` set?
