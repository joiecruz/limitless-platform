## Goal

Make the **Visual Summary** output actually produce a hand-drawn, infographic-style poster (matching the user's reference pegs — playful sketch style, central concept with branching ideas, hand-lettered titles). Mark **Slides** and **Podcast Digest** as "Coming Soon". Add Lucide icons to all three output buttons.

## What's broken today

- The `cocreation-generate-output` edge function returns only JSON (`{ sections: [...] }`) for the `visual` kind. There is no UI rendering of that JSON, so it appears as if "nothing happens".
- No image is actually generated, no file is shown to the user.

## Changes

### 1. Edge function: `supabase/functions/cocreation-generate-output/index.ts`

For `kind === "visual"`:
- Build a detailed image prompt from session title + synthesized themes that requests a hand-drawn whiteboard-style infographic (teal/orange palette, sketchy line art, central concept node with branching mini-illustrations and hand-lettered captions — matching the reference pegs).
- Call Lovable AI Gateway image model `google/gemini-3-pro-image-preview` (chat completions endpoint with `modalities: ["image","text"]`, similar to existing image-gen pattern).
- Decode the returned base64 PNG and upload it to a new public Supabase storage bucket `cocreation-outputs` at path `{session_id}/visual-{timestamp}.png`.
- Insert into `cocreation_outputs` with `content = { image_url, prompt }`.
- Return `{ ok: true, image_url }`.

For `slides` and `podcast`: return early with `{ error: "coming_soon" }` (kept disabled in UI anyway, but defensive).

### 2. New storage bucket migration

- Create public bucket `cocreation-outputs`.
- Policies: public read; insert restricted to service role (edge function uses service role, so no end-user policy needed).

### 3. UI: `src/pages/projects/co-creation/CoCreationDashboard.tsx`

- Import icons: `Image as ImageIcon`, `Presentation`, `Mic`, `Loader2` from lucide-react.
- Add state `outputLoading: kind | null` and `latestVisual: string | null`.
- On mount and after generation, fetch latest `cocreation_outputs` row where `kind = 'visual'` for this session and store `image_url`.
- Update the "Generate outputs" card:
  - **Visual summary** button: `<ImageIcon />` icon, calls `generateOutput("visual")`, shows spinner while loading, toast on success/error.
  - **Slides** button: `<Presentation />` icon, `disabled`, label "Slides — Coming soon".
  - **Podcast digest** button: `<Mic />` icon, `disabled`, label "Podcast digest — Coming soon".
- Below the buttons, when `latestVisual` exists, render the generated image inside a bordered card with a "Download" link (anchor with `download` attribute pointing to the public URL).

### 4. Toast copy

- Generating: "Creating your visual summary… this may take 20–40s."
- Success: "Visual summary ready."
- Error: surface gateway error message.

## Technical notes

- Image gen via Lovable Gateway: POST to `https://ai.gateway.lovable.dev/v1/chat/completions` with `model: "google/gemini-3-pro-image-preview"`, `modalities: ["image","text"]`, message containing the prompt. Response includes `choices[0].message.images[0].image_url.url` as a `data:image/png;base64,...` string — strip the prefix and upload bytes via `admin.storage.from('cocreation-outputs').upload(path, bytes, { contentType: 'image/png', upsert: true })`, then `getPublicUrl`.
- Handle 429 (rate limit) and 402 (credits) with friendly errors.
- Keep auth + `cocreation_can_manage` check unchanged.

## Out of scope

- Actual PPTX generation and audio podcast synthesis (deferred — buttons disabled).
- Editing/regenerating the infographic in place (single fresh render per click; new rows accumulate).
