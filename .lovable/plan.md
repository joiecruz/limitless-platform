## Plan: Redesign "The People We Help Evolve" Section

### 1. Upload persona illustrations as CDN assets
Upload the 4 uploaded images via `lovable-assets` to `src/assets/`:
- `Entpreneur.png` → Entrepreneurs and Business Owners
- `Corporate.png` → Corporate Teams and Professionals
- `Public_Servant.png` → Public Servants and Government Leaders
- `Educator.png` → Educators and Students

### 2. Update card layout in `src/pages/AIHomepage.tsx`
Match the reference screenshot layout:
- Replace lucide icon + description with: **title at top** (bold, dark) + **illustration filling the bottom of the card**.
- Update titles to: "Entrepreneurs and Business Owners", "Corporate Teams and Professionals", "Public Servants and Government Leaders", "Educators and Students".
- Remove the description text (`desc`) — reference layout has no descriptions.
- Card structure: vertical flex, padding around title, image anchored bottom, `object-contain object-bottom`, taller card (e.g. `h-[360px]`) so images sit at the edge like the reference.
- Keep 4-column grid on lg.

### 3. Hover state
- Default: `border-gray-200`.
- Hover: `hover:border-[#393CA0]` (main violet) with `transition-colors`. Keep existing subtle shadow.
- Title color on hover: `group-hover:text-[#393CA0]` (apply `group` class on the card).

### Out of scope
No changes to other sections, no description copy, no new components.
