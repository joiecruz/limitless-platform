
-- 1. MESSAGES
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users or admins can delete messages" ON public.messages;

-- 2. CHANNELS
DROP POLICY IF EXISTS "Users can read channels" ON public.channels;
DROP POLICY IF EXISTS "Users can create channels" ON public.channels;
DROP POLICY IF EXISTS "Users can create private channels in their workspace" ON public.channels;
DROP POLICY IF EXISTS "Anyone can view public channels" ON public.channels;
DROP POLICY IF EXISTS "Superadmins and admins can create channels" ON public.channels;
DROP POLICY IF EXISTS "Superadmins and admins can delete channels" ON public.channels;
DROP POLICY IF EXISTS "Superadmins and admins can update channels" ON public.channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON public.channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.channels;
DROP POLICY IF EXISTS "Platform admins can manage channels" ON public.channels;

CREATE POLICY "Platform admins can manage channels"
ON public.channels FOR ALL
TO authenticated
USING (public.is_current_user_admin_or_superadmin())
WITH CHECK (public.is_current_user_admin_or_superadmin());

-- 3. STAGE_CONTENTS
DROP POLICY IF EXISTS "Allow select for auth users" ON public.stage_contents;
DROP POLICY IF EXISTS "Authenticated users can update stage_contents" ON public.stage_contents;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.stage_contents;
DROP POLICY IF EXISTS "Authenticated users can insert stage_contents" ON public.stage_contents;
DROP POLICY IF EXISTS "Authenticated users can delete stage_contents" ON public.stage_contents;
DROP POLICY IF EXISTS "Workspace members can read stage contents" ON public.stage_contents;
DROP POLICY IF EXISTS "Workspace members can insert stage contents" ON public.stage_contents;
DROP POLICY IF EXISTS "Workspace members can update stage contents" ON public.stage_contents;
DROP POLICY IF EXISTS "Workspace admins can delete stage contents" ON public.stage_contents;

CREATE POLICY "Workspace members can read stage contents"
ON public.stage_contents FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = stage_contents.project_id AND wm.user_id = auth.uid()
  ) OR public.is_current_user_superadmin_safe()
);

CREATE POLICY "Workspace members can insert stage contents"
ON public.stage_contents FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = stage_contents.project_id AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace members can update stage contents"
ON public.stage_contents FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = stage_contents.project_id AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace admins can delete stage contents"
ON public.stage_contents FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = stage_contents.project_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('admin','owner')
  ) OR public.is_current_user_superadmin_safe()
);

-- 4. WORKSPACE_MEMBERS legacy permissive policies
DROP POLICY IF EXISTS "workspace_members_delete_policy" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_policy" ON public.workspace_members;
DROP POLICY IF EXISTS "allow_member_insert" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_policy" ON public.workspace_members;

-- 5. IDEAS / IDEA_LIKES / IDEA_COMMENTS
DROP POLICY IF EXISTS "Users can view all ideas" ON public.ideas;
DROP POLICY IF EXISTS "Authenticated users can create ideas" ON public.ideas;
DROP POLICY IF EXISTS "Workspace members can view ideas" ON public.ideas;
DROP POLICY IF EXISTS "Workspace members can create ideas" ON public.ideas;

CREATE POLICY "Workspace members can view ideas"
ON public.ideas FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = ideas.project_id AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace members can create ideas"
ON public.ideas FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE p.id = ideas.project_id AND wm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can view all idea likes" ON public.idea_likes;
DROP POLICY IF EXISTS "Authenticated users can add likes" ON public.idea_likes;
DROP POLICY IF EXISTS "Workspace members can view idea likes" ON public.idea_likes;
DROP POLICY IF EXISTS "Workspace members can add idea likes" ON public.idea_likes;

CREATE POLICY "Workspace members can view idea likes"
ON public.idea_likes FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.ideas i
    JOIN public.projects p ON p.id = i.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE i.id = idea_likes.idea_id AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace members can add idea likes"
ON public.idea_likes FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.ideas i
    JOIN public.projects p ON p.id = i.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE i.id = idea_likes.idea_id AND wm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can view all idea comments" ON public.idea_comments;
DROP POLICY IF EXISTS "Authenticated users can add comments" ON public.idea_comments;
DROP POLICY IF EXISTS "Workspace members can view idea comments" ON public.idea_comments;
DROP POLICY IF EXISTS "Workspace members can add idea comments" ON public.idea_comments;

CREATE POLICY "Workspace members can view idea comments"
ON public.idea_comments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.ideas i
    JOIN public.projects p ON p.id = i.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE i.id = idea_comments.idea_id AND wm.user_id = auth.uid()
  )
);

CREATE POLICY "Workspace members can add idea comments"
ON public.idea_comments FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.ideas i
    JOIN public.projects p ON p.id = i.project_id
    JOIN public.workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE i.id = idea_comments.idea_id AND wm.user_id = auth.uid()
  )
);

-- 6. TOOLKITS / TOOLKIT_ITEMS
DROP POLICY IF EXISTS "Authenticated users can manage toolkits" ON public.toolkits;
DROP POLICY IF EXISTS "Authenticated users can manage toolkit_items" ON public.toolkit_items;
DROP POLICY IF EXISTS "Admins can manage toolkits" ON public.toolkits;
DROP POLICY IF EXISTS "Admins can manage toolkit items" ON public.toolkit_items;

CREATE POLICY "Admins can manage toolkits"
ON public.toolkits FOR ALL TO authenticated
USING (public.is_current_user_admin_or_superadmin())
WITH CHECK (public.is_current_user_admin_or_superadmin());

CREATE POLICY "Admins can manage toolkit items"
ON public.toolkit_items FOR ALL TO authenticated
USING (public.is_current_user_admin_or_superadmin())
WITH CHECK (public.is_current_user_admin_or_superadmin());

-- 7. CONTENT_TEMPLATES
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.content_templates;
DROP POLICY IF EXISTS "Allow view for auth users" ON public.content_templates;
DROP POLICY IF EXISTS "Auth users can view content templates" ON public.content_templates;
DROP POLICY IF EXISTS "Superadmins can manage content templates" ON public.content_templates;

CREATE POLICY "Auth users can view content templates"
ON public.content_templates FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Superadmins can manage content templates"
ON public.content_templates FOR ALL TO authenticated
USING (public.is_current_user_superadmin_safe())
WITH CHECK (public.is_current_user_superadmin_safe());

-- 8. STORAGE: message-attachments
DROP POLICY IF EXISTS "Allow authenticated uploads to message-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to own folder in message-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read message-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own message-attachments" ON storage.objects;

CREATE POLICY "Authenticated users can upload to own folder in message-attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can read message-attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'message-attachments');

CREATE POLICY "Users can delete own message-attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'message-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
