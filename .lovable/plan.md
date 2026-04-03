

# Create Draft Homepage

## Summary
Create a new draft homepage at `/draft-home` with all the sections from your provided copy, without touching the existing homepage (`Index.tsx`).

## What Gets Built

A new page `src/pages/DraftHome.tsx` containing these sections as self-contained components in a new folder `src/components/draft-home/`:

1. **HeroSection** -- "Making tech work for humans..." with two CTAs (Book an AI Strategy Session, Explore Our Programs)
2. **TrustSignal** -- "Trusted by forward-thinking organizations..." reusing the existing `InfiniteLogos` component
3. **PeopleWeHelpSection** -- "The People We Help Evolve" intro text
4. **SectorCards** -- 5 cards (Corporations, Government, SMEs, Dev Orgs, Students) in a responsive grid
5. **TheFutureSection** -- "The future is ~~AI~~ Humans" with strikethrough styling
6. **TechForGoodSection** -- "Technology, Designed for People..." with 3 principle items
7. **BuiltInImpactSection** -- "Every Transformation Creates a Ripple Effect" with 3 how-we-do-it items
8. **HowWeWorkSection** -- "From Awareness to Transformation" with 3-step visual (Build Capability, Apply in Practice, Sustain & Scale)
9. **PlatformsSection** -- 3 platform cards (LimitlessBiz, LimitlessGov, Limitless Platform)
10. **SocialProofSection** -- stats and trust line
11. **AIReadinessSection** -- Two cards (Individuals / Organizations) with CTAs
12. **FinalCTASection** -- "Start Building What's Next" with two CTAs

## Route
- Add `/draft-home` route in `AppRoutes.tsx` (public, marketing section)
- Page uses existing `MainNav` and `Footer`

## Design Approach
- Follows existing brand colors (`#393CA0` primary, `#66E6F5` accent)
- Tailwind-only styling, consistent with current site patterns
- Responsive (mobile-first with `sm:`, `md:`, `lg:` breakpoints)
- Sections alternate between white and light gray backgrounds for visual rhythm
- Cards use subtle shadows and hover effects matching existing UI

## Files

| Action | File |
|--------|------|
| Create | `src/pages/DraftHome.tsx` (main page, imports all section components) |
| Create | `src/components/draft-home/HeroSection.tsx` |
| Create | `src/components/draft-home/PeopleWeHelpSection.tsx` |
| Create | `src/components/draft-home/SectorCards.tsx` |
| Create | `src/components/draft-home/TheFutureSection.tsx` |
| Create | `src/components/draft-home/TechForGoodSection.tsx` |
| Create | `src/components/draft-home/BuiltInImpactSection.tsx` |
| Create | `src/components/draft-home/HowWeWorkSection.tsx` |
| Create | `src/components/draft-home/PlatformsSection.tsx` |
| Create | `src/components/draft-home/SocialProofSection.tsx` |
| Create | `src/components/draft-home/AIReadinessSection.tsx` |
| Create | `src/components/draft-home/FinalCTASection.tsx` |
| Edit | `src/routes/AppRoutes.tsx` (add `/draft-home` route) |

## Notes
- The existing homepage at `/` remains completely untouched
- Once you're happy with the draft, swapping it in is a one-line route change
- The trust signal / logo strip section reuses the existing `InfiniteLogos` component
- The strikethrough on "AI" in "The future is ~~AI~~ Humans" will use CSS `line-through` decoration

