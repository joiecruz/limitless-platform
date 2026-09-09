# IKIGAI Vibe Coding Bootcamp Waitlist Page

## Goal
Create a new conversion-focused `/ikigai` landing page that feels native to Limitless Lab while giving the bootcamp a warm, energetic identity built around `#BD2E95`.

## Page experience
- Reuse the existing Limitless Lab public navigation, logo, button behavior, page widths, and footer.
- Add the requested IKIGAI identity beneath the existing footer logo: “IKIGAI Vibe Coding Bootcamp” and “A Limitless Lab learning experience.”
- Build the full Problem–Agitate–Solution page using the supplied copy and hierarchy:
  - Hero with eyebrow, two-part headline, CTA, microcopy, and a custom visual of scattered business tools becoming one organized system.
  - Problem cards styled as overlapping browser windows, notes, and workflow fragments.
  - Contrasting agitation statement.
  - Solution section with a clear before/after process diagram and waitlist CTA.
  - Possibilities grid with simple custom line icons.
  - Two-day desktop timeline that becomes a vertical mobile timeline.
  - Outcomes checklist, confident guarantee panel, audience list, and final waitlist form.
- Use warm off-white, white, black, pale pink, and selective IKIGAI pink accents. Keep typography editorial, spacing generous, and decoration hand-drawn rather than “tech bootcamp” themed.
- Generate one optimized, original hero illustration matching the requested transformation story; avoid stock programmer or generic AI imagery.

## Waitlist form
- Add fields for full name, email address, business or profession, and the business system they want to build.
- Validate and trim every field with Zod, enforce sensible length limits, show accessible inline errors, and disable the submit button while saving.
- Save submissions to a new `ikigai_waitlist` table.
- Treat email addresses case-insensitively and prevent duplicate registrations. Show a friendly already-registered message instead of a generic failure.
- Show the supplied success message after a successful submission.
- Add a secure public submission rule with strict database-side field validation; only authorized Limitless Lab admins can view entries. Public visitors cannot read, edit, or delete submissions.

## Interaction and accessibility
- Make every “Join the Waitlist” CTA smoothly scroll to and focus the form.
- Add a mobile-only sticky waitlist button after the visitor moves beyond the opening section, with safe bottom spacing so it never obscures content.
- Add subtle reveal motion with a `prefers-reduced-motion` fallback.
- Use semantic landmarks, one H1, ordered heading levels, descriptive image text, keyboard-visible focus states, live status messaging, and contrast-safe pink/button combinations.

## Site integration and SEO
- Register `/ikigai` as a public route without changing existing page behavior.
- Add `/ikigai` to the generated sitemap as a public marketing page.
- Add the requested title, description, self-referencing canonical URL, Open Graph fields, Twitter card fields, and relevant WebPage/EducationEvent-style structured data without inventing dates, pricing, or venue details.
- Keep the existing sitewide metadata fallback intact.

## Validation
- Verify the form’s empty, invalid, loading, success, duplicate-email, and database-error states.
- Test the rendered page at desktop and mobile widths for overflow, spacing, heading/image balance, sticky CTA behavior, form usability, and footer placement.
- Confirm all CTA links reach the waitlist and the existing site navigation remains functional.

## Technical details
- Use the existing React, Tailwind, shadcn Button/Input/Textarea, Supabase client, Helmet, and Zod patterns.
- Define page-specific semantic color tokens for IKIGAI in the global theme rather than scattering hardcoded colors through the page.
- Create the table through a Supabase migration with explicit grants, RLS, a unique normalized-email index, server-side validation, and the existing safe admin-role helper.
- Keep implementation isolated to a new page and small IKIGAI-specific components so current pages are not redesigned.
