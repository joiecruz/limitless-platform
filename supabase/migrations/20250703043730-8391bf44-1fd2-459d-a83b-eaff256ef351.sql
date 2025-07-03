
-- Create design_challenges table
CREATE TABLE public.design_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'DT',
  status TEXT NOT NULL DEFAULT 'in_progress',
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sticky_notes table for collaboration
CREATE TABLE public.sticky_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#FEF3C7',
  challenge_id UUID REFERENCES public.design_challenges(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on design_challenges
ALTER TABLE public.design_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for design_challenges
CREATE POLICY "Workspace members can view challenges"
  ON public.design_challenges
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can create challenges"
  ON public.design_challenges
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Admins and owners can update challenge status"
  ON public.design_challenges
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT wm.workspace_id 
      FROM workspace_members wm
      WHERE wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Creators, admins and owners can delete challenges"
  ON public.design_challenges
  FOR DELETE
  USING (
    created_by = auth.uid()
    OR workspace_id IN (
      SELECT wm.workspace_id 
      FROM workspace_members wm
      WHERE wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
    )
  );

-- Enable RLS on sticky_notes
ALTER TABLE public.sticky_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for sticky_notes
CREATE POLICY "Workspace members can view sticky notes"
  ON public.sticky_notes
  FOR SELECT
  USING (
    challenge_id IN (
      SELECT dc.id 
      FROM design_challenges dc
      JOIN workspace_members wm ON dc.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can create sticky notes"
  ON public.sticky_notes
  FOR INSERT
  WITH CHECK (
    challenge_id IN (
      SELECT dc.id 
      FROM design_challenges dc
      JOIN workspace_members wm ON dc.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update their own sticky notes position"
  ON public.sticky_notes
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators, admins and owners can delete sticky notes"
  ON public.sticky_notes
  FOR DELETE
  USING (
    created_by = auth.uid()
    OR challenge_id IN (
      SELECT dc.id 
      FROM design_challenges dc
      JOIN workspace_members wm ON dc.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
    )
  );

-- Enable realtime for both tables
ALTER TABLE public.design_challenges REPLICA IDENTITY FULL;
ALTER TABLE public.sticky_notes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.design_challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sticky_notes;

-- Add update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_design_challenges_updated_at
    BEFORE UPDATE ON public.design_challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sticky_notes_updated_at
    BEFORE UPDATE ON public.sticky_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
