-- AalayaSannidi: public sacred social feed for VaidikaConnect.
-- Run this in the VaidikaConnect Supabase SQL Editor after fix-admin-storage.sql.

create table if not exists public.aalaya_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  caption text default '',
  image_url text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.aalaya_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.aalaya_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.aalaya_likes (
  post_id uuid not null references public.aalaya_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (post_id, user_id)
);

create index if not exists aalaya_posts_created_at_idx on public.aalaya_posts (created_at desc);
create index if not exists aalaya_comments_post_id_created_at_idx on public.aalaya_comments (post_id, created_at asc);
create index if not exists aalaya_likes_post_id_idx on public.aalaya_likes (post_id);

alter table public.aalaya_posts enable row level security;
alter table public.aalaya_comments enable row level security;
alter table public.aalaya_likes enable row level security;

drop policy if exists "Public read access to aalaya posts" on public.aalaya_posts;
create policy "Public read access to aalaya posts"
on public.aalaya_posts for select
using (true);

drop policy if exists "Poojaris and admins can create aalaya posts" on public.aalaya_posts;
create policy "Poojaris and admins can create aalaya posts"
on public.aalaya_posts for insert
with check (
  auth.uid() = author_id
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('poojari', 'admin')
  )
);

drop policy if exists "Authors and admins can update aalaya posts" on public.aalaya_posts;
create policy "Authors and admins can update aalaya posts"
on public.aalaya_posts for update
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (profiles.role = 'poojari' and aalaya_posts.author_id = auth.uid())
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (profiles.role = 'poojari' and aalaya_posts.author_id = auth.uid())
      )
  )
);

drop policy if exists "Authors and admins can delete aalaya posts" on public.aalaya_posts;
create policy "Authors and admins can delete aalaya posts"
on public.aalaya_posts for delete
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and (
        profiles.role = 'admin'
        or (profiles.role = 'poojari' and aalaya_posts.author_id = auth.uid())
      )
  )
);

drop policy if exists "Public read access to aalaya comments" on public.aalaya_comments;
create policy "Public read access to aalaya comments"
on public.aalaya_comments for select
using (true);

drop policy if exists "Signed in users can comment on aalaya posts" on public.aalaya_comments;
create policy "Signed in users can comment on aalaya posts"
on public.aalaya_comments for insert
with check (auth.uid() = user_id);

drop policy if exists "Users and admins can delete aalaya comments" on public.aalaya_comments;
create policy "Users and admins can delete aalaya comments"
on public.aalaya_comments for delete
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

drop policy if exists "Public read access to aalaya likes" on public.aalaya_likes;
create policy "Public read access to aalaya likes"
on public.aalaya_likes for select
using (true);

drop policy if exists "Signed in users can like aalaya posts" on public.aalaya_likes;
create policy "Signed in users can like aalaya posts"
on public.aalaya_likes for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can unlike aalaya posts" on public.aalaya_likes;
create policy "Users can unlike aalaya posts"
on public.aalaya_likes for delete
using (auth.uid() = user_id);
