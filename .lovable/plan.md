## Goal
Add a dedicated navbar used only on `/ai-homepage`, leaving the existing `MainNav` untouched elsewhere.

## New file: `src/components/ai-homepage/AINav.tsx`
A copy of `MainNav` structure (fixed top, logo left, links center, CTAs right, mobile Sheet) with these changes:

**Nav items (desktop + mobile):**
1. **Why Limitless Lab** — hover/click mega-menu (see below)
2. **Who We Help** — `href="#"`
3. **Solutions** — `href="#"`
4. **Programs** — `href="#"` (single link, no sub-dropdown for now)

**CTAs (right side):**
- `Log in` → `/signin` (ghost button, unchanged)
- `Take Free AI Assessment` → `/ai-assessment` (primary `#393CA0` button, replaces Sign up)

Auth state: if `session` exists, show `WebNavProfileMenu` instead of the two CTAs (same as current MainNav).

## "Why Limitless Lab" mega-menu
Full-width panel anchored under the trigger, ~720px wide, white card with `rounded-xl` + `shadow-xl` + `border-gray-200`, opens on hover (desktop) and is keyboard-accessible. Grid of 3 columns, each a link block with:

- Square icon tile (56px, soft brand-tinted background, e.g. `bg-[#393CA0]/10`) holding a custom abstract minimalist SVG icon stroked in `#393CA0` with an `#F59E0B`/`#EC4899` accent dot or line
- Bold title + one-line muted description

Items:
| Title | Description | Link |
|---|---|---|
| About Us | Our story, mission, and the team behind Limitless Lab | `#` |
| Our Transformation Model | The human-centered AI framework that drives lasting change | `#` |
| Partner with Limitless Lab | Collaborate with us to scale impact across your organization | `#` |

Mobile: render the three items as an indented collapsible list under "Why Limitless Lab" (same `Collapsible` pattern used for Programs in `MainNav`), each row showing the small icon + title.

## Icons
Three inline React SVG components defined inside `AINav.tsx` (no asset files), each ~28px, abstract minimalist:
- **AboutUsIcon** — three overlapping circles (people) in `#393CA0` outline with one `#F59E0B` filled dot
- **TransformationIcon** — two arrows curving into an infinity/loop shape in `#393CA0` with `#EC4899` accent
- **PartnerIcon** — two interlocking brackets / handshake-abstract shapes in `#393CA0` with `#F59E0B` joining dot

All strokes `1.75`, rounded line caps, no fills except the accent dots — keeps the "abstract minimalist" feel and uses the existing brand palette already present on the page.

## Wire-up
`src/pages/AIHomepage.tsx`: replace `import { MainNav }` and `<MainNav />` with the new `AINav`. No other pages change.

## Out of scope
- No new routes created for `/ai-assessment` or the dropdown destinations — they're placeholder links to be wired later.
- No changes to existing `MainNav` or other pages.
