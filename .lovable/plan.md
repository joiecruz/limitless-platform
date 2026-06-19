Update `/ai-homepage` only. Leave other pages untouched.

## 1. Taller hero (UX-standard hero height)

In `src/pages/AIHomepage.tsx`:
- Change hero wrapper from `pt-32 pb-12` to a min-height hero: `min-h-[85vh] flex items-center pt-32 pb-20`.
- Keep left alignment and current max-width.

## 2. Headline accent color = CTA purple

- Change `text-purple-600` on "human-centered AI" to `text-[#393CA0]` (the same purple used by the Learn More / Take Free Assessment buttons).

## 3. Times New Roman Condensed for the accent

- Replace `font-serif` on the "human-centered AI" span with an inline `style={{ fontFamily: '"Times New Roman", "Times New Roman Condensed", Times, serif', fontStretch: "condensed" }}` so it renders in Times New Roman (condensed where the OS supports it) without adding a new web font.
- Keep `italic`.

## 4. New "People We Help Evolve" section

Add it right after the "We've worked with" logo block and before `<Features />`.

Inline (in `AIHomepage.tsx`, no new file) so we don't change the existing `PeopleWeHelpSection` used elsewhere. Structure:

- Section heading: "The people we help evolve" (left-aligned within max-w-7xl container, matching hero alignment).
- Short one-line subhead.
- 4-card responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, gap-6).

Cards (lucide-react icons, `#393CA0` accent):
1. Entrepreneurs & Small Businesses — icon `Rocket`
2. Corporate Teams — icon `Building2`
3. Public Servants — icon `Landmark`
4. Educators & Students — icon `GraduationCap`

Each card: white bg, subtle border, rounded-2xl, p-6, icon in a purple-tinted square, title, 1-sentence description.

## Out of scope

- No route changes, no edits to `PeopleWeHelpSection.tsx`, no changes to other pages or the design system.
