
-- Sessions
CREATE TABLE public.cocreation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  owner_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','live','synthesizing','completed')),
  event_mode boolean NOT NULL DEFAULT false,
  active_question_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cocreation_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.cocreation_sessions(id) ON DELETE CASCADE,
  position int NOT NULL,
  text text NOT NULL,
  framing text,
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  phase text,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cocreation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.cocreation_sessions(id) ON DELETE CASCADE,
  anon_token text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, anon_token)
);

CREATE TABLE public.cocreation_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.cocreation_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.cocreation_questions(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES public.cocreation_participants(id) ON DELETE CASCADE,
  original_text text NOT NULL,
  refined_text text,
  upvote_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cocreation_upvotes (
  response_id uuid NOT NULL REFERENCES public.cocreation_responses(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES public.cocreation_participants(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (response_id, participant_id)
);

CREATE TABLE public.cocreation_synthesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.cocreation_sessions(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.cocreation_questions(id) ON DELETE CASCADE,
  themes jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cocreation_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.cocreation_sessions(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('slides','visual','podcast')),
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_cocreation_questions_session ON public.cocreation_questions(session_id);
CREATE INDEX idx_cocreation_responses_session ON public.cocreation_responses(session_id);
CREATE INDEX idx_cocreation_responses_question ON public.cocreation_responses(question_id);
CREATE INDEX idx_cocreation_upvotes_response ON public.cocreation_upvotes(response_id);

-- updated_at trigger
CREATE TRIGGER trg_cocreation_sessions_updated
BEFORE UPDATE ON public.cocreation_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Upvote count trigger
CREATE OR REPLACE FUNCTION public.cocreation_update_upvote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.cocreation_responses SET upvote_count = upvote_count + 1 WHERE id = NEW.response_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.cocreation_responses SET upvote_count = GREATEST(upvote_count - 1, 0) WHERE id = OLD.response_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_cocreation_upvote_count
AFTER INSERT OR DELETE ON public.cocreation_upvotes
FOR EACH ROW EXECUTE FUNCTION public.cocreation_update_upvote_count();

-- Helper: is session publicly viewable (live/synthesizing/completed)
CREATE OR REPLACE FUNCTION public.cocreation_session_is_public(_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cocreation_sessions
    WHERE id = _session_id AND status IN ('live','synthesizing','completed')
  );
$$;

CREATE OR REPLACE FUNCTION public.cocreation_session_is_live(_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cocreation_sessions
    WHERE id = _session_id AND status = 'live'
  );
$$;

CREATE OR REPLACE FUNCTION public.cocreation_can_manage(_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cocreation_sessions s
    WHERE s.id = _session_id
      AND (
        s.owner_id = auth.uid()
        OR public.is_workspace_admin_or_owner_of(s.workspace_id)
        OR public.is_current_user_superadmin_safe()
      )
  );
$$;

-- Enable RLS
ALTER TABLE public.cocreation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocreation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocreation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocreation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocreation_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocreation_synthesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cocreation_outputs ENABLE ROW LEVEL SECURITY;

-- SESSIONS policies
CREATE POLICY "Public can view live sessions"
ON public.cocreation_sessions FOR SELECT
TO anon, authenticated
USING (status IN ('live','synthesizing','completed'));

CREATE POLICY "Workspace members can view their sessions"
ON public.cocreation_sessions FOR SELECT
TO authenticated
USING (
  public.is_workspace_member_for_view(workspace_id)
  OR public.is_current_user_superadmin_safe()
);

CREATE POLICY "Workspace members can create sessions"
ON public.cocreation_sessions FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
  AND public.is_workspace_member_for_view(workspace_id)
);

CREATE POLICY "Owner or workspace admin can update sessions"
ON public.cocreation_sessions FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid()
  OR public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
);

CREATE POLICY "Owner or workspace admin can delete sessions"
ON public.cocreation_sessions FOR DELETE
TO authenticated
USING (
  owner_id = auth.uid()
  OR public.is_workspace_admin_or_owner_of(workspace_id)
  OR public.is_current_user_superadmin_safe()
);

-- QUESTIONS policies
CREATE POLICY "Public can view questions on public sessions"
ON public.cocreation_questions FOR SELECT
TO anon, authenticated
USING (public.cocreation_session_is_public(session_id));

CREATE POLICY "Workspace members can view questions"
ON public.cocreation_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cocreation_sessions s
    WHERE s.id = session_id
      AND (
        public.is_workspace_member_for_view(s.workspace_id)
        OR public.is_current_user_superadmin_safe()
      )
  )
);

CREATE POLICY "Manager can insert questions"
ON public.cocreation_questions FOR INSERT
TO authenticated
WITH CHECK (public.cocreation_can_manage(session_id));

CREATE POLICY "Manager can update questions"
ON public.cocreation_questions FOR UPDATE
TO authenticated
USING (public.cocreation_can_manage(session_id));

CREATE POLICY "Manager can delete questions"
ON public.cocreation_questions FOR DELETE
TO authenticated
USING (public.cocreation_can_manage(session_id));

-- PARTICIPANTS policies
CREATE POLICY "Public can register as participant in live session"
ON public.cocreation_participants FOR INSERT
TO anon, authenticated
WITH CHECK (public.cocreation_session_is_live(session_id));

CREATE POLICY "Public can view participants of public sessions"
ON public.cocreation_participants FOR SELECT
TO anon, authenticated
USING (public.cocreation_session_is_public(session_id));

CREATE POLICY "Manager can manage participants"
ON public.cocreation_participants FOR ALL
TO authenticated
USING (public.cocreation_can_manage(session_id))
WITH CHECK (public.cocreation_can_manage(session_id));

-- RESPONSES policies
CREATE POLICY "Public can view responses on public sessions"
ON public.cocreation_responses FOR SELECT
TO anon, authenticated
USING (public.cocreation_session_is_public(session_id));

CREATE POLICY "Public can insert responses on live unlocked questions"
ON public.cocreation_responses FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cocreation_sessions s
    JOIN public.cocreation_questions q ON q.id = question_id
    WHERE s.id = session_id
      AND s.status = 'live'
      AND q.session_id = s.id
      AND q.locked = false
      AND (s.event_mode = false OR s.active_question_id = q.id)
  )
);

CREATE POLICY "Manager can update responses"
ON public.cocreation_responses FOR UPDATE
TO authenticated
USING (public.cocreation_can_manage(session_id));

CREATE POLICY "Manager can delete responses"
ON public.cocreation_responses FOR DELETE
TO authenticated
USING (public.cocreation_can_manage(session_id));

-- UPVOTES policies
CREATE POLICY "Public can view upvotes on public sessions"
ON public.cocreation_upvotes FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cocreation_responses r
    WHERE r.id = response_id
      AND public.cocreation_session_is_public(r.session_id)
  )
);

CREATE POLICY "Public can upvote on live sessions"
ON public.cocreation_upvotes FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cocreation_responses r
    WHERE r.id = response_id
      AND public.cocreation_session_is_live(r.session_id)
  )
);

CREATE POLICY "Public can remove their own upvote on live session"
ON public.cocreation_upvotes FOR DELETE
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cocreation_responses r
    WHERE r.id = response_id
      AND public.cocreation_session_is_live(r.session_id)
  )
);

-- SYNTHESIS policies
CREATE POLICY "Public can view synthesis on public sessions"
ON public.cocreation_synthesis FOR SELECT
TO anon, authenticated
USING (public.cocreation_session_is_public(session_id));

CREATE POLICY "Manager can manage synthesis"
ON public.cocreation_synthesis FOR ALL
TO authenticated
USING (public.cocreation_can_manage(session_id))
WITH CHECK (public.cocreation_can_manage(session_id));

-- OUTPUTS policies
CREATE POLICY "Public can view outputs on public sessions"
ON public.cocreation_outputs FOR SELECT
TO anon, authenticated
USING (public.cocreation_session_is_public(session_id));

CREATE POLICY "Manager can manage outputs"
ON public.cocreation_outputs FOR ALL
TO authenticated
USING (public.cocreation_can_manage(session_id))
WITH CHECK (public.cocreation_can_manage(session_id));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.cocreation_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cocreation_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cocreation_upvotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cocreation_questions;
