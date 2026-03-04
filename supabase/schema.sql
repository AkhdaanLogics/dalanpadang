-- =====================================
-- Extensions
-- =====================================
create extension if not exists "pgcrypto";

-- =====================================
-- Table: products
-- =====================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  code text not null unique,
  category text not null default 'koleksi-premium',
  description text not null,
  image_url text not null,
  price numeric null,
  show_price boolean not null default false,
  negotiable boolean not null default false,
  status text not null check (status in ('available', 'sold')) default 'available',
  created_at timestamptz not null default now()
);

alter table public.products
add column if not exists negotiable boolean not null default false;

alter table public.products
add column if not exists category text not null default 'koleksi-premium';

update public.products
set category = case
  when category = 'harian' then 'koleksi-reguler'
  when category = 'langka' then 'koleksi-langka'
  when category = 'pusaka' then 'koleksi-premium'
  else category
end;

alter table public.products
drop constraint if exists products_category_check;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_category_check'
  ) then
    alter table public.products
    add constraint products_category_check
    check (category in ('koleksi-reguler', 'koleksi-langka', 'koleksi-premium'));
  end if;
end $$;

-- =====================================
-- Table: inquiries
-- =====================================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_created_at on public.products(created_at desc);
create index if not exists idx_inquiries_product_id on public.inquiries(product_id);
create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);

-- =====================================
-- Row Level Security
-- =====================================
alter table public.products enable row level security;
alter table public.inquiries enable row level security;

-- Public read policy (strict): only available products.
drop policy if exists "Public read available products" on public.products;
create policy "Public read available products"
on public.products
for select
to anon, authenticated
using (status = 'available');

-- Admin full access policy using auth.jwt() claim app_metadata.role = admin
-- You can also rely on service role from server.
drop policy if exists "Admin full products access" on public.products;
create policy "Admin full products access"
on public.products
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public create inquiries" on public.inquiries;
create policy "Public create inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admin read inquiries" on public.inquiries;
create policy "Admin read inquiries"
on public.inquiries
for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admin full inquiries" on public.inquiries;
create policy "Admin full inquiries"
on public.inquiries
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================
-- Storage bucket and policies
-- =====================================
insert into storage.buckets (id, name, public)
values ('produk-keris', 'produk-keris', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('backups', 'backups', false)
on conflict (id) do nothing;

-- Public read product images
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'produk-keris');

-- Admin upload product images
drop policy if exists "Admin write product images" on storage.objects;
create policy "Admin write product images"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'produk-keris'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'produk-keris'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Admin manage backup files
drop policy if exists "Admin backups" on storage.objects;
create policy "Admin backups"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'backups'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'backups'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- =====================================
-- Optional: Edge Function schedule backup (Option B)
-- =====================================
-- 1) Deploy an edge function named `daily-backup`.
-- 2) Configure a cron in Supabase Dashboard (daily) to call it.
-- 3) Function reads products and writes JSON to storage bucket `backups`.
