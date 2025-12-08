-- Fix SECURITY DEFINER functions to have fixed search_path
-- This prevents potential search path attacks

-- Update is_workspace_admin function
CREATE OR REPLACE FUNCTION public.is_workspace_admin(workspace_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = $1 
    AND user_id = auth.uid()
    AND role = 'admin'
  );
END;
$function$;

-- Update delete_user_data function
CREATE OR REPLACE FUNCTION public.delete_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  uid uuid;
BEGIN
  uid := auth.uid();
  
  DELETE FROM messages WHERE user_id = uid;
  DELETE FROM message_reactions WHERE user_id = uid;
  DELETE FROM enrollments WHERE user_id = uid;
  DELETE FROM workspace_members WHERE user_id = uid;
  DELETE FROM profiles WHERE id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$function$;

-- Update is_workspace_member(uuid, uuid) function
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  ) THEN
    RETURN EXISTS (
      SELECT 1 
      FROM workspace_members 
      WHERE workspace_members.workspace_id = $1 
      AND workspace_members.user_id = $2
    );
  END IF;
  
  IF auth.uid() = user_id THEN
    RETURN EXISTS (
      SELECT 1 
      FROM workspace_members 
      WHERE workspace_members.workspace_id = $1 
      AND workspace_members.user_id = $2
    );
  END IF;
  
  RETURN false;
END;
$function$;

-- Update is_workspace_admin_or_owner function
CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_owner(workspace_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  IF NOT (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_superadmin = true)
    OR auth.uid() = user_id
  ) THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_members.workspace_id = $1 
    AND workspace_members.user_id = $2
    AND workspace_members.role IN ('admin', 'owner')
  );
END;
$function$;

-- Update cleanup_expired_invitations function
CREATE OR REPLACE FUNCTION public.cleanup_expired_invitations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE workspace_invitations
  SET status = 'expired'
  WHERE status = 'pending' 
  AND expires_at < NOW();
END;
$function$;

-- Update create_workspace_with_owner function
CREATE OR REPLACE FUNCTION public.create_workspace_with_owner(workspace_name text, workspace_slug text, owner_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  workspace_record record;
BEGIN
  INSERT INTO public.workspaces (name, slug)
  VALUES (workspace_name, workspace_slug)
  RETURNING * INTO workspace_record;

  INSERT INTO public.workspace_members (user_id, workspace_id, role)
  VALUES (owner_id, workspace_record.id, 'owner');

  RETURN row_to_json(workspace_record);
END;
$function$;

-- Update is_workspace_member_secure function
CREATE OR REPLACE FUNCTION public.is_workspace_member_secure(workspace_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = $1 
    AND user_id = $2
  );
$function$;

-- Update get_course_enrollment_count function
CREATE OR REPLACE FUNCTION public.get_course_enrollment_count(course_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(
    (SELECT COUNT(*)::integer FROM enrollments WHERE course_id = course_id_param), 
    0
  );
$function$;

-- Update check_workspace_membership function
CREATE OR REPLACE FUNCTION public.check_workspace_membership(workspace_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_id_param 
    AND user_id = auth.uid()
  );
END;
$function$;

-- Update is_workspace_member(uuid) function
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM workspace_members 
    WHERE workspace_id = workspace_id_param 
    AND user_id = auth.uid()
  );
END;
$function$;

-- Create explicit RLS policies for articles table
-- First drop the ALL policy if it exists
DROP POLICY IF EXISTS "Admins and superadmins have full access" ON public.articles;
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON public.articles;

-- Create explicit policies
CREATE POLICY "Anyone can view published articles"
ON public.articles
FOR SELECT
USING (published = true OR is_current_user_admin_or_superadmin());

CREATE POLICY "Admins can insert articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (is_current_user_admin_or_superadmin());

CREATE POLICY "Admins can update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (is_current_user_admin_or_superadmin());

CREATE POLICY "Admins can delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (is_current_user_admin_or_superadmin());