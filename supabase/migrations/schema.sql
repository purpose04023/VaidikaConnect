-- DDL Schema Setup for Vaidika Connect Migration (Firebase -> Supabase)

-- 1. Profiles Table (Users & Poojaris)
create table if not exists public.profiles (
  id uuid primary key,
  role text not null check (role in ('user', 'poojari', 'admin')),
  full_name text not null,
  phone_call text,
  phone_whatsapp text,
  experience_years int default 0,
  lat double precision,
  lng double precision,
  available_timings text,
  photo text,
  photo_hint text,
  verified boolean default false,
  verified_by text,
  verified_at text,
  rating double precision default 5.0,
  review_count int default 0,
  base_price int default 5000,
  qualifications text[],
  languages text[],
  pujas text[], -- program IDs (can be references or dynamic keys)
  max_participants int default 50,
  description text,
  gallery jsonb default '[]'::jsonb,
  reviews jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Allow public read access to profiles"
  on public.profiles for select
  using (true);

create policy "Allow users to insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow admins to delete profiles"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Allow admins to update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 2. Programs Table (Vaidika Poojas)
create table if not exists public.programs (
  id uuid default gen_random_uuid() primary key,
  title text not null, -- English title
  title_te text,       -- Telugu title
  description text,    -- English description
  description_te text, -- Telugu description
  image_url text,
  image_hint text,
  category text,       -- Telugu category
  category_en text,    -- English category
  categories text[],
  required_items text[],
  sloka_tags jsonb default '[]'::jsonb,
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Programs
alter table public.programs enable row level security;

create policy "Allow public read access to programs"
  on public.programs for select
  using (true);

create policy "Allow admins full access to programs"
  on public.programs for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 3. Stotrams Table (Deity Readings)
create table if not exists public.stotrams (
  id uuid default gen_random_uuid() primary key,
  deity_name text not null, -- English nameEn
  name_te text,             -- Telugu name
  gender text not null check (gender in ('male', 'female')),
  image_hint text,
  image_url text,
  ashtotharam_text text,
  sahasranamam_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Stotrams
alter table public.stotrams enable row level security;

create policy "Allow public read access to stotrams"
  on public.stotrams for select
  using (true);

create policy "Allow admins full access to stotrams"
  on public.stotrams for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 4. Global Settings Table (CMS Admin Keys)
create table if not exists public.global_settings (
  id text primary key, -- key
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Global Settings
alter table public.global_settings enable row level security;

create policy "Allow public read access to global_settings"
  on public.global_settings for select
  using (true);

create policy "Allow admins full access to global_settings"
  on public.global_settings for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 5. Join Requests Table (Poojari Application Forms)
create table if not exists public.join_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  photo text,
  phone text not null,
  email text,
  city text,
  location text,
  qualifications text[],
  languages text[],
  experience int default 0,
  base_price int default 5000,
  max_participants int default 50,
  pujas text[],
  description text,
  whatsapp text,
  available_timings text,
  lat double precision,
  lng double precision,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Join Requests
alter table public.join_requests enable row level security;

create policy "Allow public insert access to join_requests"
  on public.join_requests for insert
  with check (true);

create policy "Allow admins full access to join_requests"
  on public.join_requests for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 6. Trigger to automatically create a profile row when a new user signs up in Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    case
      when new.email in ('sudhee.sripada@gmail.com', 'purpose04023@gmail.com') then 'admin'
      else 'user'
    end,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
