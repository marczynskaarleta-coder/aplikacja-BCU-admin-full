-- ============================================================
-- ETAP 3: Moduły, pliki, linki
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Rozszerz tabelę modules
alter table public.modules
  add column if not exists category      text,
  add column if not exists difficulty    text default 'beginner'
    check (difficulty in ('beginner','intermediate','advanced')),
  add column if not exists status        text not null default 'draft'
    check (status in ('draft','published')),
  add column if not exists thumbnail_url text,
  add column if not exists created_by    uuid references public.profiles(id) on delete set null;

-- Istniejące aktywne moduły → published
update public.modules set status = 'published' where is_active = true;
update public.modules set status = 'draft'     where is_active = false;

-- 2. Tabela plików modułów
create table if not exists public.module_files (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references public.modules(id) on delete cascade,
  name         text not null,
  file_url     text not null,
  file_type    text,
  file_size    bigint,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- 3. Tabela linków modułów
create table if not exists public.module_links (
  id         uuid primary key default gen_random_uuid(),
  module_id  uuid not null references public.modules(id) on delete cascade,
  title      text not null,
  url        text not null,
  type       text default 'link' check (type in ('video','article','download','link')),
  created_at timestamptz not null default now()
);

-- 4. RLS
alter table public.module_files  enable row level security;
alter table public.module_links  enable row level security;

-- Moduły: użytkownicy widzą tylko published
drop policy if exists "Zalogowani czytają moduły"  on public.modules;
drop policy if exists "Admin zarządza modułami"    on public.modules;

create policy "Moduły: odczyt"
  on public.modules for select
  to authenticated
  using (status = 'published' or public.get_my_role() = 'admin');

create policy "Moduły: zapis przez admina"
  on public.modules for all
  using (public.get_my_role() = 'admin');

-- Pliki: zalogowani pobierają, admin zarządza
create policy "Pliki modułów: odczyt"
  on public.module_files for select
  to authenticated
  using (true);

create policy "Pliki modułów: zapis przez admina"
  on public.module_files for all
  using (public.get_my_role() = 'admin');

-- Linki: zalogowani czytają, admin zarządza
create policy "Linki modułów: odczyt"
  on public.module_links for select
  to authenticated
  using (true);

create policy "Linki modułów: zapis przez admina"
  on public.module_links for all
  using (public.get_my_role() = 'admin');

-- 5. Storage bucket dla plików modułów (jeśli nie istnieje)
insert into storage.buckets (id, name, public)
  values ('module-files', 'module-files', true)
  on conflict (id) do nothing;

drop policy if exists "Zalogowani pobierają pliki modułów" on storage.objects;
drop policy if exists "Admin wgrywa pliki modułów"         on storage.objects;
drop policy if exists "Admin usuwa pliki modułów"          on storage.objects;

create policy "Storage: odczyt plików modułów"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'module-files');

create policy "Storage: upload przez admina"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'module-files'
    and public.get_my_role() = 'admin'
  );

create policy "Storage: usuwanie przez admina"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'module-files'
    and public.get_my_role() = 'admin'
  );
