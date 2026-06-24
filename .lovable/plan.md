1. **Logos section** (`AIHomepage.tsx`): Change "We've worked with" to "Trusted by leading organizations across sectors" (using same heading styling).

2. **People we help evolve section** (`AIHomepage.tsx`): Keep current 4-card grid layout and persona images, but update copy to match mockup tone — confirming the existing heading/subheading is fine, no structural change to the card grid.

3. **DesignThinkingSection.tsx**: Convert to a 2-column layout inside `max-w-7xl`. Left column holds eyebrow + title + body. Right column is a placeholder slot for the upcoming graphic (empty div, no placeholder image). Stacks on mobile.

4. **Body text size in 3 sections** (`DesignThinkingSection`, `BeliefFutureSection`, `BeliefTransformationSection`): Change body paragraphs from `text-lg`/`text-base` to `text-lg sm:text-xl text-gray-600` to match hero blurb size/font.

5. **Headline**: Leave the current hero `h1` as-is (already breaks into 2 lines).