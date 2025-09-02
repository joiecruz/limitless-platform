-- Fix critical security vulnerabilities while maintaining user access

-- 1. Fix projects table - restrict to workspace members and superadmins
DROP POLICY IF EXISTS "Users can view projects they have access to" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects in workspaces they belong to" ON public.projects;
DROP POLICY IF EXISTS "Users can update projects they have access to" ON public.projects;
DROP POLICY IF EXISTS "Users can delete projects they created" ON public.projects;

CREATE POLICY "Projects accessible to workspace members"
ON public.projects
FOR SELECT
TO authenticated
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR public.is_current_user_superadmin_safe()
);

CREATE POLICY "Projects manageable by workspace members"
ON public.projects
FOR ALL
TO authenticated
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR public.is_current_user_superadmin_safe()
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
  OR public.is_current_user_superadmin_safe()
);

-- 2. Secure lessons table - only enrolled users, those with access, or superadmins
DROP POLICY IF EXISTS "Allow public read access to lessons for counting" ON public.lessons;
DROP POLICY IF EXISTS "Lessons are viewable by enrolled users or with access" ON public.lessons;

CREATE POLICY "Lessons viewable by authorized users only"
ON public.lessons
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM enrollments
    WHERE course_id = lessons.course_id AND user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_course_access
    WHERE course_id = lessons.course_id AND user_id = auth.uid()
  )
  OR public.is_current_user_superadmin_safe()
);

-- 3. Fix missing RLS policies for tables without any policies

-- Methodologies table
CREATE POLICY "Methodologies viewable by authenticated users"
ON public.methodologies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Methodologies manageable by superadmins"
ON public.methodologies
FOR ALL
TO authenticated
USING (public.is_current_user_superadmin_safe())
WITH CHECK (public.is_current_user_superadmin_safe());

-- Methodology stages table  
CREATE POLICY "Methodology stages viewable by authenticated users"
ON public.methodology_stages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Methodology stages manageable by superadmins"
ON public.methodology_stages
FOR ALL
TO authenticated
USING (public.is_current_user_superadmin_safe())
WITH CHECK (public.is_current_user_superadmin_safe());

-- Content dependencies table
CREATE POLICY "Content dependencies viewable by authenticated users"
ON public.content_dependencies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Content dependencies manageable by superadmins"
ON public.content_dependencies
FOR ALL
TO authenticated
USING (public.is_current_user_superadmin_safe())
WITH CHECK (public.is_current_user_superadmin_safe());