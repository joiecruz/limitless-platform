## Goal
Add a "Who We Help" mega-menu to `AINav` mirroring the "Why Limitless Lab" pattern, and create blank placeholder pages at `/entrepreneurs`, `/corporates`, `/government`, `/schools`.

## 1. Update `src/components/ai-homepage/AINav.tsx`
Replace the simple "Who We Help" link with a mega-menu identical in style to the existing Why mega-menu (white card, rounded-xl, shadow-xl, hover-open), but using a 2x2 grid (4 personas):

| Title | Description | Link |
|---|---|---|
| Entrepreneurs & Business Owners | Grow your venture with human-centered AI | `/entrepreneurs` |
| Corporate Teams & Professionals | Lead innovation and upskill your teams | `/corporates` |
| Public Servants & Government Leaders | Deliver better services with AI-powered design | `/government` |
| Educators & Students | Learn, teach, and build the future of work | `/schools` |

Use React Router `Link` for these (real routes, unlike the Why dropdown placeholders).

Add 4 new inline abstract minimalist SVG icons (~28px, stroke 1.75, `#393CA0` strokes with `#F59E0B` or `#EC4899` accent dots), matching the existing icon style:
- **EntrepreneurIcon** — a stylized rocket/upward arrow with an accent spark
- **CorporateIcon** — overlapping rectangles (cards/teams) with one accent dot
- **GovernmentIcon** — abstract pillared arch with an accent dot above
- **EducatorIcon** — open book / mortarboard cap silhouette with accent dot

Mobile: extend the Sheet menu with a second `Collapsible` for "Who We Help" containing the four persona links (icon + title), same styling pattern as the Why collapsible.

## 2. Create 4 blank pages
Minimal pages following the existing site shell (`AINav` + `Footer`), each showing the persona title in a hero block and a short placeholder paragraph. Files:
- `src/pages/personas/Entrepreneurs.tsx`
- `src/pages/personas/Corporates.tsx`
- `src/pages/personas/Government.tsx`
- `src/pages/personas/Schools.tsx`

Each page sets a `<Helmet>` title, renders `<AINav />`, a centered hero (`min-h-[60vh]`) with the page name + "Coming soon" copy, then `<Footer />`.

## 3. Register routes in `src/routes/AppRoutes.tsx`
Add four public routes alongside `/ai-homepage`:
```
<Route path="/entrepreneurs" element={<Entrepreneurs />} />
<Route path="/corporates" element={<Corporates />} />
<Route path="/government" element={<Government />} />
<Route path="/schools" element={<Schools />} />
```
Plus the four imports.

## Out of scope
- No other pages or navs change.
- No real content for the persona pages yet — just placeholder shells.
