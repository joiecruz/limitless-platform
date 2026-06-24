## Revert persona cards & section heading fonts

### 1. Persona card titles (AIHomepage.tsx)
- Reduce from `text-3xl sm:text-[2rem] lg:text-[2.25rem] leading-[1]` back to `text-2xl sm:text-[1.6rem] leading-tight`
- Keep the `Times New Roman MT Condensed Bold` inline fontFamily

### 2. Section eyebrow labels (DesignThinkingSection.tsx, BeliefSections.tsx)
- **No change** — keep `text-sm sm:text-base` size and Times New Roman MT Condensed Bold font

### 3. Section headings (DesignThinkingSection.tsx, BeliefSections.tsx)
- Revert font style: remove the inline `fontFamily: "Times New Roman MT Condensed Bold"...` style
- Keep the current larger size (`text-4xl sm:text-5xl lg:text-6xl`) since the user only asked to revert the font style, not the size
- Keep `font-bold text-gray-900 leading-tight`

### 4. Hero "human-centered AI" (AIHomepage.tsx)
- **No change** — keep Times New Roman MT Condensed Bold italic

### Files to edit
- `src/pages/AIHomepage.tsx`
- `src/components/ai-homepage/DesignThinkingSection.tsx`
- `src/components/ai-homepage/BeliefSections.tsx`