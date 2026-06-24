## Plan: Build out the rest of `/ai-homepage`

Replace the existing `<Features>`, Blog, and CTA sections on `src/pages/AIHomepage.tsx` with the sections shown in the new mockup. Keep `MainNav`, the hero, logos, and "People We Help Evolve" sections unchanged. Keep `Footer`.

### New section order (after "People We Help Evolve")

1. **How We Work — Design Thinking and Systems Thinking, Amplified by AI**
   - Left-aligned `OUR APPROACH` eyebrow + bold title
   - Two paragraphs of body copy (transcribed from mockup)
   - White background, narrow centered column, generous vertical padding

2. **The future is AI HUMAN + AI** (belief band)
   - Right-aligned within the container per mockup
   - Eyebrow `OUR BELIEF` in violet
   - Headline with "AI" struck through and "HUMAN + AI" highlighted in cyan `#66E6F5`
   - Two paragraphs of body copy
   - White background (continues the previous section visually)

3. **Transformation by design** (belief band)
   - Left-aligned within the container
   - Eyebrow `OUR BELIEF` in violet
   - Headline + two paragraphs
   - White background

4. **What Our Customers and Stakeholders Are Saying**
   - Light gray (`bg-gray-50`) background
   - Centered title
   - Two-row marquee/scrolling rail of testimonial cards with subtle edge fade. Each card has avatar, name, 5-star row, short body.
   - Pull testimonials from the `testimonials` table (limit 8–12, mixed types). Render real avatars when `photo_url` is set, otherwise a neutral initial avatar.

5. **Start with Clarity. Know Where You Stand.**
   - Reuse the existing `AIReadinessSection` component from `src/components/draft-home/AIReadinessSection.tsx` (matches the mockup exactly: violet title, "For Individuals" + "For Organizations" cards, "Diagnose it." footer line).

### Implementation details

- Create three new components in `src/components/ai-homepage/`:
  - `DesignThinkingSection.tsx` (section 1)
  - `BeliefSections.tsx` exporting `BeliefFutureSection` and `BeliefTransformationSection` (sections 2 + 3)
  - `TestimonialsRailSection.tsx` (section 4) — uses `@tanstack/react-query` + the existing `supabase` client to fetch testimonials. Two horizontal rows animated with pure CSS `@keyframes` translateX (offsetting the second row to the opposite direction). No new dependencies.
- Update `src/pages/AIHomepage.tsx`:
  - Remove the `<Features />`, Blog block, and `<CTASection />`.
  - Import and render the four new sections + reuse `AIReadinessSection` in the order above, between the existing "People We Help Evolve" section and the `<Footer />`.
- Use the project's existing violet `#393CA0` and cyan `#66E6F5` consistently; no new tokens.
- Headings use the same Tailwind classes already in use across the page (`text-3xl sm:text-4xl font-bold`), preserving visual rhythm.

### Copy (transcribed from the mockup)

- **Design Thinking section** title: `Design Thinking and Systems Thinking, Amplified by AI`
  - Body 1: "At Limitless Lab, we combine design thinking, systems thinking, and AI literacy into one integrated approach. Because the organizations that thrive won't be the ones who adopted AI fastest. They'll be the ones who understood their problems most clearly before they did."
  - Body 2: "We work with teams to move from reactive adoption to intentional transformation: diagnosing the real challenge, designing the right response, and building the capability to keep going after we leave."

- **Belief — future**: `The future is AI HUMAN + AI` ("AI" struck through, "HUMAN + AI" in cyan)
  - Body 1: "Technology accelerates what humans decide to do with it. That's why we never put the tool before the person."
  - Body 2: "Every program, product, and engagement we design starts with one question: what does this human need to thrive? AI is the amplifier. Human capacity is the foundation."

- **Belief — transformation**: `Transformation by design`
  - Body 1: "Change doesn't happen by accident. And it doesn't happen in a one-day workshop either."
  - Body 2: "Real transformation requires a system: the right mindsets built first, the right tools introduced next, and the right structures put in place to make it stick. That's the Limitless approach. Every engagement is designed from the outcome backward, so you're not just inspired — you're equipped."

- **Testimonials** title: `What Our Customers and Stakeholders Are Saying` (cards populated from the live `testimonials` table)

### Out of scope

- No changes to hero, logos, "People We Help Evolve", `MainNav`, or `Footer`.
- No new design tokens, no new packages, no DB writes.
- No edits to anything under `src/components/draft-home/` other than reusing `AIReadinessSection`.
