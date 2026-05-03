insert into storage.buckets (id, name, public) values ('cocreation-outputs', 'cocreation-outputs', true) on conflict (id) do nothing;

create policy "Public read cocreation outputs"
on storage.objects for select
using (bucket_id = 'cocreation-outputs');