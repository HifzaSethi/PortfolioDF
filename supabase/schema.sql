-- Digital Field. (DF.) Admin CMS Schema, RLS Policies, and Storage Setup
-- Run this script once in the Supabase Dashboard -> SQL Editor.

-- 1. Admin allowlist table (managed manually by the project owner in Supabase)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Authenticated user can inspect own admin record" on public.admins;
create policy "Authenticated user can inspect own admin record"
  on public.admins
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Prevent client-side writes to public.admins; manage admins only via Supabase SQL Editor / Dashboard
revoke insert, update, delete on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

-- 2. Security-definer authorization helper
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  )
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Audit trigger helper (sets updated_at and authenticated updated_by server-side)
create or replace function public.df_touch_audit_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  if auth.uid() is not null then
    new.updated_by := coalesce(nullif(auth.jwt() ->> 'email', ''), auth.uid()::text);
  end if;
  return new;
end;
$$;

-- 4. Site Content table (key, JSON value, draft/published status, audit fields)
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null check (key in (
    'site_settings',
    'performance_marketing',
    'search_intelligence',
    'studio',
    'industries'
  )),
  value jsonb not null,
  status text not null check (status in ('draft', 'published')) default 'published',
  updated_at timestamptz not null default now(),
  updated_by text,
  constraint site_content_key_status_unique unique (key, status)
);

alter table public.site_content enable row level security;

drop trigger if exists trg_site_content_audit on public.site_content;
create trigger trg_site_content_audit
  before insert or update on public.site_content
  for each row
  execute function public.df_touch_audit_fields();

drop policy if exists "Public can read published site_content" on public.site_content;
create policy "Public can read published site_content"
  on public.site_content
  for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "Admins can insert site_content" on public.site_content;
create policy "Admins can insert site_content"
  on public.site_content
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site_content" on public.site_content;
create policy "Admins can update site_content"
  on public.site_content
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site_content" on public.site_content;
create policy "Admins can delete site_content"
  on public.site_content
  for delete
  to authenticated
  using (public.is_admin());

grant select, insert, update, delete on public.site_content to authenticated;
grant select on public.site_content to anon;

-- 5. Portfolio Items table (Selected Work on DF. Studio)
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 160),
  client text not null default '' check (char_length(client) <= 160),
  discipline text not null check (char_length(trim(discipline)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 2000),
  image_path text not null default '' check (char_length(image_path) <= 500),
  external_url text check (
    external_url is null
    or external_url = ''
    or external_url ~* '^https?://'
  ),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.portfolio_items enable row level security;

drop trigger if exists trg_portfolio_items_audit on public.portfolio_items;
create trigger trg_portfolio_items_audit
  before insert or update on public.portfolio_items
  for each row
  execute function public.df_touch_audit_fields();

drop policy if exists "Public can read published portfolio_items" on public.portfolio_items;
create policy "Public can read published portfolio_items"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "Admins can insert portfolio_items" on public.portfolio_items;
create policy "Admins can insert portfolio_items"
  on public.portfolio_items
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update portfolio_items" on public.portfolio_items;
create policy "Admins can update portfolio_items"
  on public.portfolio_items
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete portfolio_items" on public.portfolio_items;
create policy "Admins can delete portfolio_items"
  on public.portfolio_items
  for delete
  to authenticated
  using (public.is_admin());

grant select, insert, update, delete on public.portfolio_items to authenticated;
grant select on public.portfolio_items to anon;

-- 6. Storage Bucket for Portfolio Media (public read, admin-only write, 5 MB max, JPEG/PNG/WebP only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin())
  with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin());
