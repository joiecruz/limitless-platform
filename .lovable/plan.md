## Plan: Integrate Uploaded Custom Font

The persona card titles currently reference `"Times New Roman MT Condensed bold"` in CSS, but the actual font file is not loaded — it falls back to system defaults. You uploaded the `.otf` file; here's how we'll wire it up:

### Steps

1. **Upload font to CDN**
   - Use `lovable-assets create` to upload `Times_New_Roman_MT_Condensed_Bold.otf` from the upload mount to the Lovable CDN.
   - Write the resulting `.asset.json` pointer to `src/assets/`.

2. **Add `@font-face` declaration**
   - In `src/index.css`, add a `@font-face` block:
     - `font-family: "Times New Roman MT Condensed Bold"`
     - `src: url(<cdn-url>) format("opentype")`
     - `font-weight: 700`
     - `font-style: normal`
   - This makes the font available across the app.

3. **Update persona card reference**
   - In `src/pages/AIHomepage.tsx` (the persona card `<h3>`), replace the inline `style={{ fontFamily: ... }}` with the exact `@font-face` family name so it resolves to the real font file.

No other files or layout changes are needed.

### Technical notes
- The CSP already allows `font-src 'self' data:;`. The CDN asset will be served from the same origin (`/__l5e/assets-v1/...`), so it complies.
- The original font file will not be kept in the repo; only the `.asset.json` pointer stays.