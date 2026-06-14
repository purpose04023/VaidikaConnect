-- VaidikaConnect admin/storage repair script.
-- Run this once in Supabase SQL Editor for the VaidikaConnect project.
-- It creates the public image bucket and keeps writes limited to authenticated admins.

-- 1. Ensure columns used by the admin portal exist.
alter table public.programs add column if not exists program_type text default 'VAIDIKA_POOJA';
alter table public.programs add column if not exists categories text[] default '{}'::text[];
alter table public.programs add column if not exists required_items text[] default '{}'::text[];
alter table public.programs add column if not exists sloka_tags jsonb default '[]'::jsonb;
alter table public.programs add column if not exists pdf_url text;
alter table public.programs add column if not exists image_hint text;
alter table public.programs add column if not exists title_te text;
alter table public.programs add column if not exists description_te text;

alter table public.stotrams add column if not exists ashtotharam_url text;
alter table public.stotrams add column if not exists sahasranamam_url text;
alter table public.stotrams add column if not exists reading_slug text;

alter table public.profiles add column if not exists phone_whatsapp text;
alter table public.profiles add column if not exists available_timings text;
alter table public.profiles add column if not exists base_price int default 5000;
alter table public.profiles add column if not exists max_participants int default 50;
alter table public.profiles add column if not exists gallery jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists reviews jsonb default '[]'::jsonb;

-- 2. Create the public asset bucket used by src/utils/supabase/storage.ts.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vaidika-assets',
  'vaidika-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 3. Keep image reads public, but allow uploads/updates/deletes only for logged-in admins.
drop policy if exists "Public read access for vaidika assets" on storage.objects;
create policy "Public read access for vaidika assets"
on storage.objects for select
using (bucket_id = 'vaidika-assets');

drop policy if exists "Admin insert access for vaidika assets" on storage.objects;
drop policy if exists "Admin and poojari insert access for vaidika assets" on storage.objects;
create policy "Admin and poojari insert access for vaidika assets"
on storage.objects for insert
with check (
  bucket_id = 'vaidika-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (
          profiles.role = 'poojari'
          and (storage.foldername(name))[1] = 'aalaya-sannidi'
        )
      )
  )
);

drop policy if exists "Admin update access for vaidika assets" on storage.objects;
drop policy if exists "Admin and poojari update access for vaidika assets" on storage.objects;
create policy "Admin and poojari update access for vaidika assets"
on storage.objects for update
using (
  bucket_id = 'vaidika-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (
          profiles.role = 'poojari'
          and owner = auth.uid()
          and (storage.foldername(name))[1] = 'aalaya-sannidi'
        )
      )
  )
)
with check (
  bucket_id = 'vaidika-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (
          profiles.role = 'poojari'
          and (storage.foldername(name))[1] = 'aalaya-sannidi'
        )
      )
  )
);

drop policy if exists "Admin delete access for vaidika assets" on storage.objects;
drop policy if exists "Admin and poojari delete access for vaidika assets" on storage.objects;
create policy "Admin and poojari delete access for vaidika assets"
on storage.objects for delete
using (
  bucket_id = 'vaidika-assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (
          profiles.role = 'poojari'
          and owner = auth.uid()
          and (storage.foldername(name))[1] = 'aalaya-sannidi'
        )
      )
  )
);
