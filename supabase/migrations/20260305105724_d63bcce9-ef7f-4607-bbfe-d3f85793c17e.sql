update public.enrollments
set completed_lessons = case
    when not ('775b19c2-2c49-411f-85e6-0014666df478'::uuid = any(coalesce(completed_lessons, '{}'::uuid[])))
      then array_append(coalesce(completed_lessons, '{}'::uuid[]), '775b19c2-2c49-411f-85e6-0014666df478'::uuid)
    else coalesce(completed_lessons, '{}'::uuid[])
  end,
  progress = 100,
  updated_at = now()
where id = '0b77fcd9-2bc4-4492-a767-69a5dac7539a'::uuid;