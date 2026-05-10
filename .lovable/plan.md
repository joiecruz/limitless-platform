# Standalone App Prompt: AI-Assisted Co-Creation (Visual Summary + Slides)

Below is a ready-to-paste prompt you can drop into a brand-new Lovable project. It distills your existing flow (sessions → questions → crowdsourced responses → AI synthesis → visual summary / slides) into a focused product spec. Copy everything inside the code block.

---

```
Build a web app called "CoCreate AI" — a facilitator tool that turns a live or async group brainstorm into two polished deliverables: a hand-drawn Visual Summary poster and a Slide Deck. Keep the scope tight to these two outputs.

## Product overview
A facilitator creates a Session with a title, short description, and 3–7 guide Questions. Participants join via a public link (no login required), submit ideas under each question, and upvote others' ideas. When the facilitator clicks "Synthesize", AI clusters the responses per question into 3–5 themed insights (label + 1–2 sentence insight). From that synthesis the facilitator can generate:
1. A Visual Summary — a single landscape, sketch-noted/whiteboard-style poster image.
2. A Slide Deck — a 6–12 slide presentation (title slide, one slide per question with its themes, closing slide), exportable as PDF or PPTX, and presentable in-app fullscreen.

## User roles
- Facilitator (authenticated): creates sessions, invites participants, runs synthesis, generates outputs.
- Participant (anonymous, link-only): submits and upvotes ideas. No account required. Identified by a display name they pick once, stored in localStorage + a participant row.

Use Lovable Cloud for auth, database, storage, and edge functions. Use the Lovable AI Gateway (google/gemini-2.5-flash for text synthesis, google/gemini-2.5-flash-image-preview for the visual summary image).

## Core screens
1. Landing page — explains the product, "Create a session" CTA, sign in / sign up.
2. Facilitator dashboard — list of sessions with status (draft, live, closed), create button, delete with confirm.
3. Session editor — edit title, description, and ordered questions (add / reorder / delete). Toggle status live/closed. Copy public participation link. Show response counts per question.
4. Public participation page (/c/:slug) — shows session title + description, then each question with: a textarea to submit an idea, and the existing ideas as cards with upvote buttons (one upvote per participant per idea, toggleable). Real-time updates via Supabase Realtime.
5. Synthesis & outputs page — facilitator-only. Buttons:
   - "Run synthesis" → calls edge function, shows themes per question (editable inline: label, insight, delete, reorder).
   - "Generate visual summary" → calls edge function, displays the returned image, with download and regenerate.
   - "Generate slides" → calls edge function, opens an in-app slide viewer.
6. Slide viewer — fullscreen-capable presenter mode (arrow keys, Esc), thumbnail strip, export to PDF and PPTX.

## Data model (Lovable Cloud / Postgres)
- profiles (id, display_name, avatar_url)
- sessions (id, owner_id, title, description, slug unique, status enum: draft|live|closed, last_synthesis_at, created_at, updated_at)
- questions (id, session_id, position int, text, framing nullable)
- participants (id, session_id, display_name, anon_token unique, created_at)
- responses (id, session_id, question_id, participant_id, original_text, refined_text nullable, upvote_count int default 0, created_at)
- upvotes (id, response_id, participant_id, unique(response_id, participant_id))
- synthesis (id, session_id, question_id, themes jsonb)  -- themes = [{label, insight}]
- outputs (id, session_id, kind enum: visual|slides, content jsonb, created_at)
  -- visual content: { image_url, prompt }
  -- slides content: { slides: [{ title, bullets[], notes? }] }

RLS:
- Facilitators only see/manage their own sessions and child rows.
- Anonymous participants can read a session + its questions + responses if status='live' (matched by slug). They can insert responses/upvotes scoped to their anon_token's participant row.
- Outputs and synthesis read-allowed for participants on live sessions; write only via edge functions using service role.

## Edge functions
1. synthesize { session_id }
   - Auth: facilitator only (verify owner_id = auth.uid()).
   - For each question: gather responses ordered by upvotes, call Gemini with a tool/function-call schema returning { themes: [{label, insight}] } (3–5 items). Replace existing synthesis rows for the session.
   - Return { themes_created }. Surface 402/429 errors clearly ("AI credits exhausted", "Rate limited").

2. generate-visual { session_id }
   - Auth: facilitator only. Require synthesis to exist; otherwise return a clear error: "Run synthesis first".
   - Build a strict prompt from session title + each question + its themes. Rules embedded in the prompt:
     - Sketch-noted / graphic-recording aesthetic; watercolor washes (teal, orange, mustard, soft greens) on off-white.
     - Hand-lettered legible text; render ONLY the provided title, question headings, and theme labels/insights — no invented words, captions, stats, names, or icons.
     - Decoration limited to abstract marks (arrows, dots, underlines, banners). No representational icons unless a theme label literally names that object.
     - Preserve exact wording, capitalization, punctuation. Omit questions with no themes.
     - Layout: title prominent at top; each question a labeled section with its themes beneath; sketchy connectors between sections only.
   - Call google/gemini-2.5-flash-image-preview with modalities: ["image","text"], decode the data URL, upload to a public 'cocreation-outputs' storage bucket at `${session_id}/visual-${ts}.png`, insert outputs row, return the public URL.

3. generate-slides { session_id }
   - Auth: facilitator only. Require synthesis.
   - Call Gemini with a tool schema returning a structured deck:
     { slides: [
        { type: 'title', title, subtitle? },
        { type: 'question', question, themes: [{label, insight}] },  // one per question that has themes
        { type: 'closing', title, takeaways: [string] }
     ] }
   - Insert outputs row with kind='slides' and the deck json. Return the deck.

## Slide rendering
- Render slides in React using a fixed 1920x1080 canvas scaled to fit (transform: scale) so the same component works for thumbnails, editor, and fullscreen presenter mode.
- Theme: clean editorial style — cream/off-white backgrounds, one bold accent color, a serif display font for titles paired with a clean sans for body. No purple gradients, no Inter. Pick one motif (e.g., a hand-drawn underline under the title) and reuse it.
- PDF export: use jsPDF (capture each slide via html-to-image then add as image pages). PPTX export: use pptxgenjs, embedding images as base64.
- Fullscreen presenter: Fullscreen API, arrow/space navigation, Esc to exit, auto-hide cursor.

## Visual / brand direction
- Bold, editorial, slightly hand-crafted feel that mirrors the sketch-noted output. Off-white background (#FAF7F2), ink black text (#1B1B1B), one warm accent (terracotta #B85042) and one cool accent (teal #028090). Display font: "Fraunces" or "DM Serif Display"; body: "Inter Tight" or "Manrope". Use generous whitespace, asymmetric hero on the landing page, large typography. Define everything as semantic HSL tokens in index.css and tailwind.config.ts. Never use raw color classes in components.

## Nice-to-haves (only after core works)
- Refine an idea button on participation cards (calls a refine edge function that rewrites the idea more clearly while preserving meaning).
- Inline edit of synthesis themes before generating outputs.
- Regenerate visual with a "style variant" picker (watercolor, mono ink, marker).
- Public read-only share link for the final outputs page.

## Out of scope
- Audio/podcast outputs.
- Workspace/team membership and role hierarchies.
- Comments, chat, or messaging.
- Long-form analytics dashboards.

Start by scaffolding the schema, RLS, and the two main flows (facilitator dashboard + public participation). Then add synthesize, then generate-visual, then generate-slides. Verify each step before moving on.
```

---

## Notes for you
- The prompt deliberately scopes out podcast/workspace features so the new app stays lean.
- It carries over the strict image-generation guardrails from your current `cocreation-generate-output` function so the visual summary keeps the same fidelity.
- The slide deck is generated as structured JSON (not as an image) so it's editable and exportable to PDF/PPTX.
- When you paste it into a new Lovable project, Lovable will ask to enable Cloud and the AI Gateway — accept both.

