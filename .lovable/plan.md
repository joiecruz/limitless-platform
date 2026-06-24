## Plan

### 1. Reduce section heading font sizes slightly
- **DesignThinkingSection.tsx**: Reduce the `h2` from `text-4xl sm:text-5xl lg:text-6xl` → one step smaller (e.g., `text-3xl sm:text-4xl lg:text-5xl`).
- **BeliefSections.tsx**: Reduce both "The future is HUMAN + AI" and "Transformation by design" `h2` elements from `text-4xl sm:text-5xl lg:text-6xl` → one step smaller (e.g., `text-3xl sm:text-4xl lg:text-5xl`).

### 2. Tighten hero margins so headline wraps to 2 lines
- **AIHomepage.tsx**: Reduce the hero container horizontal padding from `px-4 sm:px-6 lg:px-8` to a tighter value (e.g., `px-3 sm:px-4 lg:px-6`) so the `h1` has more width, causing the headline to wrap to just 2 lines instead of 3.