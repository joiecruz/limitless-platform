# AI-Assisted Co-Creation — Projects Template

A new template inside the existing Projects module (alongside "Start with design thinking" and "Collect ideas"). Owners create a co-creation session with guide questions, publish a public link/QR for anonymous participation, then trigger AI synthesis and outputs.

## User flow

1. **Create** — Owner picks "AI-Assisted Co-Creation" from CreateProjectDialog → wizard captures title, description, 3–5 guide questions (each with optional framing + examples), and Event Mode toggle.
2. **Publish** — Generates `/cocreate/:slug` public link + QR code. Status: draft → live → synthesizing → completed.
3. **Participate (public, no auth)** — Anonymous user gets assigned a friendly name (e.g. "Curious Panda"), stored in localStorage. They answer questions, submit multiple short ideas, see others' ideas live, upvote.
4. **Owner controls** — Live dashboard shows counts/trending. In Event Mode, owner activates one question at a time and can lock phases.
5. **AI refinement** — On submission, optional AI rewrite (clarity, framing) preserving meaning.
6. **Pre-synthesis** — Owner sees draft theme groupings + duplicate flags, can adjust.
7. **Synthesis** — AI produces 3–5 themed insights per question.
8. **Outputs** — Generate slides, visual summary, podcast-style digest (text script).

## Pages & components (new)

```
src/pages/projects/co-creation/
  CoCreationCreate.tsx          # owner wizard
  CoCreationDashboard.tsx       # owner live view + synthesis + outputs
  CoCreationPublic.tsx          # public participant view (/cocreate/:slug)
src/components/projects/co-creation/
  GuideQuestionEditor.tsx
  QRCodeBlock.tsx
  ResponseCard.tsx              # idea + upvote + anon name
  LiveResponsesPanel.tsx
  ThemePreviewPanel.tsx
  SynthesisOutput.tsx
  OutputSlides.tsx / OutputVisual.tsx / OutputPodcast.tsx
  EventModeControls.tsx
src/lib/anonymousName.ts        # adjective+animal generator
```

Wire a third tile into `CreateProjectDialog.tsx` ("AI-Assisted Co-Creation") that routes to `/dashboard/projects/co-creation/new`. Add public route `/cocreate/:slug` in `AppRoutes.tsx` (outside DashboardLayout, no auth).

## Database (migration)

```sql
create table cocreation_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  owner_id uuid not null references auth.users(id),
  title text not null,
  description text,
  slug text unique not null,
  status text not null default 'draft',          -- draft|live|synthesizing|completed
  event_mode boolean not null default false,
  active_question_id uuid,                       -- for event mode
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table cocreation_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references cocreation_sessions(id) on delete cascade,
  position int not null,
  text text not null,
  framing text,
  examples jsonb default '[]'::jsonb,
  phase text,                                    -- e.g. Problems/Opportunities/Recs
  locked boolean not null default false
);

create table cocreation_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references cocreation_sessions(id) on delete cascade,
  anon_token text not null,                      -- random per-browser id
  display_name text not null,                    -- "Curious Panda"
  created_at timestamptz default now(),
  unique(session_id, anon_token)
);

create table cocreation_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references cocreation_sessions(id) on delete cascade,
  question_id uuid not null references cocreation_questions(id) on delete cascade,
  participant_id uuid not null references cocreation_participants(id) on delete cascade,
  original_text text not null,
  refined_text text,
  upvote_count int not null default 0,
  created_at timestamptz default now()
);

create table cocreation_upvotes (
  response_id uuid references cocreation_responses(id) on delete cascade,
  participant_id uuid references cocreation_participants(id) on delete cascade,
  primary key (response_id, participant_id)
);

create table cocreation_synthesis (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references cocreation_sessions(id) on delete cascade,
  question_id uuid references cocreation_questions(id) on delete cascade,
  themes jsonb not null,                         -- [{label, insight, supporting_response_ids[]}]
  created_at timestamptz default now()
);

create table cocreation_outputs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references cocreation_sessions(id) on delete cascade,
  kind text not null,                            -- slides|visual|podcast
  content jsonb not null,
  created_at timestamptz default now()
);
```

### RLS (per security memory: workspace-scoped private, but session is intentionally public when status='live')

- `cocreation_sessions`: SELECT public if `status in ('live','synthesizing','completed')` (anon allowed); full CRUD limited to workspace members; status/event/synthesis writes limited to owner or workspace admin via `is_workspace_admin_or_owner_of`.
- `cocreation_questions`: SELECT inherits session visibility; writes by session owner / workspace admin.
- `cocreation_participants`: INSERT allowed for `anon` when parent session is live; SELECT only by workspace member or by matching `anon_token` (passed as request header / RPC arg).
- `cocreation_responses`: INSERT allowed for `anon` when session live AND (event_mode=false OR question = active_question_id) AND question not locked; SELECT public on live sessions; UPDATE/DELETE by workspace owner only.
- `cocreation_upvotes`: INSERT/DELETE allowed for `anon` participant on live sessions; trigger updates `upvote_count`.
- `cocreation_synthesis` / `cocreation_outputs`: SELECT public on live/completed; writes by workspace admin/owner only.

Realtime: enable replication on `cocreation_responses`, `cocreation_upvotes`, `cocreation_sessions` so public + owner views update live.

## Edge functions (new)

All call Lovable AI Gateway (`google/gemini-3-flash-preview` default), key already in secrets.

- `cocreation-refine-response` — input: response text + question + framing; returns 1–2 sentence rewrite.
- `cocreation-pre-synthesis` — groups responses into draft themes, flags duplicates.
- `cocreation-synthesize` — produces 3–5 themed insights per question; writes `cocreation_synthesis`.
- `cocreation-generate-output` — kind=slides|visual|podcast; structured tool-calling output; writes `cocreation_outputs`.

All validate input with zod, include CORS, return clear 402/429 errors. Public-callable functions verify `session.status='live'` and use service role internally; never trust client-supplied workspace claims.

## Anonymous identity

`src/lib/anonymousName.ts` exports `generateAnonName()` combining ~30 friendly adjectives × ~30 animals. Token = `crypto.randomUUID()` stored in `localStorage` keyed per session slug. Public page upserts a `cocreation_participants` row and uses returned id for all writes.

## Event Mode

Owner dashboard exposes EventModeControls: toggle, set active question, lock/unlock per question, optional countdown timer (client-side). Public page highlights the active question and disables others.

## QR + share

Use `qrcode` library (already-allowed: jsPDF approach not needed) to render an SVG/PNG of `${window.location.origin}/cocreate/${slug}` on the dashboard with copy-link button.

## Out of scope (this plan)

- Editing/reordering questions after going live (ship later)
- Exporting outputs to .pptx (slides shown in-app; PDF export can follow)
- Moderation/blocklist for inappropriate inputs (note as follow-up)

## Technical notes

- New routes: `/dashboard/projects/co-creation/new`, `/dashboard/projects/co-creation/:id` (owner), `/cocreate/:slug` (public, no DashboardLayout, no auth gate).
- Public page uses `supabase` anon client; RLS does the gating.
- React Query for fetch + Supabase realtime channels for live updates.
- Reuse existing `LoadingSpinner`, `Button`, `Dialog`, `Card`, `Badge` from shadcn.
- Follow security memory: never expose service role; admin checks via `is_workspace_admin_or_owner_of`; explicit `search_path = public` on any new SQL functions.
