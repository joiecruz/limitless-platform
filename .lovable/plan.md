Restore the hero image and two-column layout in `src/pages/AIHomepage.tsx` that was removed in the previous edit. Keep only the headline split into two lines as requested.

What changed (to revert):
- Hero image import (`heroAsset`) was removed
- Two-column grid layout with the image on the right was replaced by a single-column text-only layout
- Section container classes changed from `min-h-[85vh] flex items-center` etc. to a simple centered section
- Button `rounded-xl` classes and `px-8` sizing were introduced; original had `px-10` and no rounded corners
- Subtitle empty `<p>` tag was removed

Plan:
1. Re-add `import heroAsset from "@/assets/limitless-lab-hero.png.asset.json";`
2. Restore the original two-column grid wrapper (`grid lg:grid-cols-2`, `max-w-7xl`, `min-h-[85vh]`, etc.)
3. Keep the headline as two lines (`<span className="block">` around "Grow beyond limits" and "with human-centered AI")
4. Restore the right-side hero `<img>` using `heroAsset.url`
5. Revert button and subtitle styling back to original (remove `rounded-xl`, restore `px-10`, restore empty `<p>` spacer)

No other files affected.