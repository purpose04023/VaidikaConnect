-- Migration: Create custom_pooja_requests table
-- Paste and run this script inside your Supabase SQL Editor.

create table if not exists public.custom_pooja_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  pooja_description text not null,
  preferred_date date,
  preferred_time text,
  pandit_count text,
  location text,
  budget text,
  notes text,
  status text default 'new',
  total_amount decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.custom_pooja_requests enable row level security;

-- Policies
drop policy if exists "Allow public insert to custom_pooja_requests" on public.custom_pooja_requests;
create policy "Allow public insert to custom_pooja_requests"
  on public.custom_pooja_requests for insert
  with check (true);

drop policy if exists "Allow users to read their own custom_pooja_requests" on public.custom_pooja_requests;
create policy "Allow users to read their own custom_pooja_requests"
  on public.custom_pooja_requests for select
  using (
    auth.uid() = user_id 
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.phone_call = phone
    )
  );

drop policy if exists "Allow admins full access to custom_pooja_requests" on public.custom_pooja_requests;
create policy "Allow admins full access to custom_pooja_requests"
  on public.custom_pooja_requests for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
