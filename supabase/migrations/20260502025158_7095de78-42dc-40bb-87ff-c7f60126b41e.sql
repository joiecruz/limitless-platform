-- Aggregated admin analytics RPC.
-- Returns all dashboard metrics in a single small JSON payload so the
-- frontend no longer needs to pull entire `sessions`, `messages`, and
-- `profiles` tables for the period.

CREATE OR REPLACE FUNCTION public.get_admin_analytics(days_back integer DEFAULT 7)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  filter_date timestamptz := now() - (days_back || ' days')::interval;
  today_date timestamptz := date_trunc('day', now());
  week_ago timestamptz := now() - interval '7 days';
  month_ago timestamptz := now() - interval '30 days';

  total_users_v bigint;
  daily_signups_v bigint;
  weekly_signups_v bigint;
  monthly_signups_v bigint;
  dau_v bigint;
  wau_v bigint;
  activated_users_v bigint;
  activation_rate_v numeric;
  session_frequency_v numeric;
  top_features_v jsonb;
  most_active_users_v jsonb;
  signups_over_time_v jsonb;
  retention_v jsonb;
BEGIN
  -- Authorization: admin / superadmin only.
  IF NOT public.is_current_user_admin_or_superadmin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT count(*) INTO total_users_v FROM profiles;

  SELECT count(*) INTO daily_signups_v FROM profiles WHERE created_at >= today_date;
  SELECT count(*) INTO weekly_signups_v FROM profiles WHERE created_at >= week_ago;
  SELECT count(*) INTO monthly_signups_v FROM profiles WHERE created_at >= month_ago;

  SELECT count(DISTINCT user_id) INTO dau_v
    FROM sessions WHERE started_at >= today_date;

  SELECT count(DISTINCT user_id) INTO wau_v
    FROM sessions WHERE started_at >= week_ago;

  SELECT count(DISTINCT user_id) INTO activated_users_v FROM workspace_members;

  activation_rate_v := CASE WHEN total_users_v > 0
    THEN (activated_users_v::numeric / total_users_v::numeric) * 100
    ELSE 0 END;

  -- Top features (message reaction emojis)
  SELECT COALESCE(jsonb_agg(jsonb_build_object('feature', emoji, 'count', cnt) ORDER BY cnt DESC), '[]'::jsonb)
    INTO top_features_v
    FROM (
      SELECT emoji, count(*)::bigint AS cnt
      FROM message_reactions
      WHERE created_at >= filter_date
      GROUP BY emoji
      ORDER BY cnt DESC
      LIMIT 5
    ) t;

  -- Session frequency last 7 days
  SELECT COALESCE(AVG(c), 0) INTO session_frequency_v
    FROM (
      SELECT count(*)::numeric AS c
      FROM sessions
      WHERE started_at >= week_ago
      GROUP BY user_id
    ) s;

  -- Most active users (by message count, last 7 days)
  SELECT COALESCE(jsonb_agg(jsonb_build_object('id', uid, 'email', email, 'actionCount', cnt) ORDER BY cnt DESC), '[]'::jsonb)
    INTO most_active_users_v
    FROM (
      SELECT m.user_id AS uid, p.email AS email, count(*)::bigint AS cnt
      FROM messages m
      JOIN profiles p ON p.id = m.user_id
      WHERE m.created_at >= week_ago
      GROUP BY m.user_id, p.email
      ORDER BY cnt DESC
      LIMIT 10
    ) au;

  -- Signups over time (per day)
  SELECT COALESCE(jsonb_agg(jsonb_build_object('date', d, 'count', cnt) ORDER BY d), '[]'::jsonb)
    INTO signups_over_time_v
    FROM (
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS d, count(*)::bigint AS cnt
      FROM profiles
      WHERE created_at >= filter_date
      GROUP BY date_trunc('day', created_at)
    ) s;

  -- Retention rates (cohort: users created in last 30 days, activity = messages)
  WITH cohort AS (
    SELECT id, created_at::date AS signup_day
    FROM profiles
    WHERE created_at >= now() - interval '30 days'
  ),
  activity AS (
    SELECT m.user_id, m.created_at::date AS act_day
    FROM messages m
    WHERE m.user_id IN (SELECT id FROM cohort)
      AND m.created_at >= now() - interval '60 days'
  ),
  flags AS (
    SELECT
      c.id,
      bool_or(a.act_day = c.signup_day + 1)  AS d1,
      bool_or(a.act_day = c.signup_day + 7)  AS d7,
      bool_or(a.act_day = c.signup_day + 30) AS d30
    FROM cohort c
    LEFT JOIN activity a ON a.user_id = c.id
    GROUP BY c.id
  )
  SELECT jsonb_build_object(
    'day1',  COALESCE(avg(CASE WHEN d1  THEN 1 ELSE 0 END) * 100, 0),
    'day7',  COALESCE(avg(CASE WHEN d7  THEN 1 ELSE 0 END) * 100, 0),
    'day30', COALESCE(avg(CASE WHEN d30 THEN 1 ELSE 0 END) * 100, 0)
  ) INTO retention_v
  FROM flags;

  result := jsonb_build_object(
    'totalUsers',     total_users_v,
    'newSignups',     jsonb_build_object('daily', daily_signups_v, 'weekly', weekly_signups_v, 'monthly', monthly_signups_v),
    'activeUsers',    jsonb_build_object('dau', dau_v, 'wau', wau_v),
    'activationRate', activation_rate_v,
    'topFeatures',    top_features_v,
    'retentionRates', COALESCE(retention_v, jsonb_build_object('day1', 0, 'day7', 0, 'day30', 0)),
    'sessionFrequency', session_frequency_v,
    'mostActiveUsers', most_active_users_v,
    'signupsOverTime', signups_over_time_v
  );

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_analytics(integer) FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_analytics(integer) TO authenticated;