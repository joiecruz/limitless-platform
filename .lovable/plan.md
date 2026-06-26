# AI Transformation Index (ATI) Assessment

A full-page, persona-adaptive lead-magnet quiz at `/ati` with progressive lead capture and Supabase persistence.

## Route & Structure

- New route `/ati` registered in `src/routes/AppRoutes.tsx`
- Page: `src/pages/ATI.tsx` — single page, screen state machine (`'persona' | 'questions' | 'preview' | 'results'`)
- Footer link + nav entry under Programs/Tools (optional — confirm below)
- SEO: Helmet with title "AI Transformation Index — Free Assessment | Limitless Lab", canonical, OG tags

## Component Files

```
src/components/ati/
  PersonaIntake.tsx       Screen 1: 5 persona cards + context pills
  AssessmentQuestions.tsx Screen 2: question runner, progress bar, pillar tabs
  QuestionCard.tsx        Single question with 5 maturity options (auto-advance)
  ScorePreview.tsx        Screen 3: hero score, locked card, lead form
  LeadCaptureForm.tsx     Inline form (zod-validated)
  FullResults.tsx         Screen 4: pillar bars, top-3 recommendations, CTAs
  PillarBar.tsx           Reusable horizontal score bar
  data/questions.ts       16 universal + 5×4 persona questions (100 total)
  data/personas.ts        Persona definitions + context options
  data/recommendations.ts Per-pillar, per-persona recommendation copy
  data/levels.ts          Maturity bands + persona-specific descriptions
  lib/scoring.ts          Overall + per-pillar scoring, band lookup
```

## Data Model

**Question shape**
```ts
{ id: string; pillar: 'strategy'|'people'|'operations'|'data'|'technology'|'impact';
  scope: 'universal'|'persona'; text: string; options: [string,string,string,string,string] }
```

**State**
```ts
{ screen, persona, context, answers: number[], score, pillarScores, leadId }
```

## Scoring

- Each answer index 0–4 → score 1–5
- Overall = round((sum / (count × 5)) × 100)
- Pillar score = same formula on that pillar's questions
- Bands: 0–20 Beginner · 21–40 Emerging · 41–60 Developing · 61–80 Advanced · 81–100 Leader
- Top 3 recommendations = 3 lowest pillar scores, each mapped to persona-specific copy

## Supabase

New table `public.ati_leads` (migration):
```
id uuid pk, created_at timestamptz default now(),
first_name text, email text, organization text, referral_source text,
persona text, context text,
answers jsonb, overall_score int, pillar_scores jsonb
```
- GRANT INSERT to anon (public lead magnet), SELECT to authenticated+service_role
- RLS: allow anonymous INSERT only; SELECT restricted to admins via `is_current_user_admin_or_superadmin()`
- Frontend writes via `supabase.from('ati_leads').insert(...)` using anon key

## Flow Details

**Screen 1** — Grid of 5 persona cards (lucide icons: Briefcase, Building2, Landmark, GraduationCap, BookOpen). On selection, secondary pills appear below. "Begin Assessment →" disabled until both chosen.

**Screen 2** — One question per view, top progress bar (`current/total`), 6 pillar dots/tabs colored as complete/active/pending. Tag chip "Universal" (teal `bg-teal-100 text-teal-700`) or "Your role" (amber `bg-amber-100 text-amber-700`). 5 maturity option cards with index badge. Click → store answer → 250ms delay → advance. Back always visible; Next as fallback.

**Screen 3** — Large overall score, level label, persona-specific level sentence. Below: blurred preview card (CSS `blur-sm` + dark overlay + lock icon) teasing pillar bars. "Unlock my full results →" reveals `LeadCaptureForm` inline. On valid submit → insert into `ati_leads` → transition to Screen 4.

**Screen 4** — Hero with score + persona context tag, 6 pillar bars, top-3 recommendations list, two CTAs ("Book a free AI Readiness Consultation" → `/contact` or mailto, "Retake Assessment" → reset state to Screen 1).

## Validation

`LeadCaptureForm` uses `zod`:
- firstName: trimmed, 1–80 chars
- email: trimmed, email format, ≤255
- organization: trimmed, 1–120
- referralSource: optional enum

## Design

- Reuse brand: primary `#393CA0`, accent `#66E6F5`, Times New Roman MT Condensed Bold for hero numerals (already loaded)
- Match existing AI homepage card aesthetic (rounded-2xl, border hover `#393CA0`)
- Fully responsive, mobile-first
- `AINav` + `Footer` wrapping the page

## Open questions

1. Consultation CTA target: existing `mailto:hello@limitlesslab.org`, the new Partner page, or a different URL?
2. Add `/ati` to main nav (e.g. under About or as a top-level "Free Assessment" link) or footer only?
3. Should results also be emailed to the lead via the existing `send-email` edge function, or only stored in Supabase for now?
