## Goal
In `AINav`: remove "Solutions", convert "Programs" into a mega-menu with real program links, and add a "Resources" mega-menu.

## Changes to `src/components/ai-homepage/AINav.tsx`

### Remove
- The "Solutions" link in both desktop nav and mobile Sheet.

### Programs mega-menu
Replace the current single "Programs" link with a 2x2 mega-menu (same style: white card, rounded-xl, shadow-xl, hover-open, `Link` to real routes).

Items (with new abstract minimalist SVG icons inline in the file, brand colors `#393CA0` strokes + `#F59E0B`/`#EC4899` accents, same style as existing icons):

| Title | Description | Link | Icon concept |
|---|---|---|---|
| LimitlessGov | Capability development for public servants | `/programs/limitlessgov` | Shield/government building abstract |
| AI Ready ASEAN | Regional AI literacy initiative | `/programs/ai-ready-asean` | Network of connected nodes |
| AIM ASEAN | AI for MSME regional program | `/programs/aim-asean` | Upward bar chart / growth |
| LimitlessBiz | Innovation program for entrepreneurs | `/programs/limitlessbiz` | Spark / lightbulb abstract |

### Resources mega-menu
New nav item "Resources" after Programs with a 3-column mega-menu:

| Title | Description | Link | Icon concept |
|---|---|---|---|
| Blog Articles | Insights on innovation, AI, and design | `/blog` | Stacked lines / document abstract |
| Tools | Hands-on tools to apply our methods | `/tools` | Toolkit / wrench-grid abstract |
| Courses | Self-paced learning on AI and innovation | `/courses` | Open book / play triangle abstract |

### Mobile
- Drop the "Solutions" and standalone "Programs" links.
- Add two new `Collapsible` blocks (Programs, Resources) following the same icon+title pattern as the Why / Who collapsibles. Add `programsOpenMobile` and `resourcesOpenMobile` state.

## Out of scope
- No other files change; no new routes (all targets already exist).
- Existing icons (`AboutUsIcon`, persona icons, etc.) stay untouched.
