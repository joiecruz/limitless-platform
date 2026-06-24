## Changes to `/ai-homepage`

### 1. Persona card titles — bigger, tighter
File: `src/pages/AIHomepage.tsx` (the persona `<h3>` around line 154)
- Increase size from `text-2xl sm:text-[1.6rem]` → `text-3xl sm:text-[2rem] lg:text-[2.25rem]`
- Change `leading-tight` → `leading-[1]` for tighter line spacing
- Keep the Times New Roman MT Condensed Bold font

### 2. Hero "human-centered AI" — italic in the same custom font
File: `src/pages/AIHomepage.tsx` (lines 50–59)
- Update the inline `style` `fontFamily` to `'"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif'` so it uses the self-hosted font
- Keep the existing `italic` class so it renders italicized (the font file is roman; browsers will synthesize an italic slant on top of the condensed bold weight, matching the rest of the site since no separate italic file was provided)

### 3. Section eyebrow labels + headings — new font, bigger
Files: `src/components/ai-homepage/DesignThinkingSection.tsx`, `src/components/ai-homepage/BeliefSections.tsx` (both `BeliefFutureSection` and `BeliefTransformationSection`)

For the small eyebrow labels ("How we work", "Our belief", "Our belief"):
- Change from `text-xs` → `text-sm sm:text-base`
- Apply `fontFamily: '"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif'` via inline style
- Keep uppercase tracking + `#393CA0` color

For the big section headings ("Design Thinking and Systems Thinking, Amplified by AI", "The future is HUMAN + AI", "Transformation by design"):
- Bump size from `text-3xl sm:text-4xl` → `text-4xl sm:text-5xl lg:text-6xl`
- Apply the same Times New Roman MT Condensed Bold font via inline style
- Keep existing color/leading

No other components, routes, or layout structure change.