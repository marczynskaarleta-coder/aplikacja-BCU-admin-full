-- ============================================================
-- ETAP 2: Role i status użytkowników
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Dodaj kolumny role i status do profiles
alter table public.profiles
  add column if not exists role   text not null default 'user'
    check (role in ('admin', 'user', 'editor', 'trainer')),
  add column if not exists status text not null default 'active'
    check (status in ('active', 'inactive', 'blocked'));

-- 2. Funkcja pomocnicza: pobiera rolę bieżącego użytkownika
--    (security definer = nie powoduje rekurencji w RLS)
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- 3. Zaktualizuj polityki RLS dla profiles
drop policy if exists "Użytkownik widzi swój profil"      on public.profiles;
drop policy if exists "Użytkownik edytuje swój profil"    on public.profiles;
drop policy if exists "Admin widzi wszystkie profile"     on public.profiles;
drop policy if exists "Admin zarządza profilami"          on public.profiles;

-- Każdy widzi swój profil; admin widzi wszystkie
create policy "Profiles: odczyt"
  on public.profiles for select
  using (
    auth.uid() = id
    or public.get_my_role() = 'admin'
  );

-- Użytkownik edytuje swój profil (imię, nazwisko)
create policy "Profiles: własna edycja"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    -- user nie może sam sobie zmienić roli ani statusu
    role = (select role from public.profiles where id = auth.uid())
    and status = (select status from public.profiles where id = auth.uid())
  );

-- Admin może edytować każdy profil (w tym role i status)
create policy "Profiles: edycja przez admina"
  on public.profiles for update
  using (public.get_my_role() = 'admin');

-- Admin może usuwać profile
create policy "Profiles: usuwanie przez admina"
  on public.profiles for delete
  using (public.get_my_role() = 'admin');

-- 4. Zaktualizuj trigger — ustawia rolę 'admin' dla ADMIN_EMAIL
--    Zastąp 'TWOJ_EMAIL@gmail.com' swoim adresem e-mail
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  user_role text := 'user';
begin
  -- Jeśli email zgadza się z ADMIN_EMAIL — nadaj rolę admin
  -- Zmień poniższy email na swój ADMIN_EMAIL
  if new.email = 'marczynskaarleta@gmail.com' then
    user_role := 'admin';
  end if;

  insert into public.profiles (id, email, first_name, last_name, role, status)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    user_role,
    'active'
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

-- 5. Ustaw rolę admina dla istniejącego konta (jednorazowo)
--    Zmień email na swój ADMIN_EMAIL
update public.profiles
  set role = 'admin'
  where email = 'marczynskaarleta@gmail.com';

-- 6. Tabela logów akcji adminów
create table if not exists public.admin_actions_log (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid not null references public.profiles(id) on delete set null,
  action_type  text not null,
  target_type  text,
  target_id    uuid,
  details      jsonb,
  created_at   timestamptz not null default now()
);

alter table public.admin_actions_log enable row level security;

create policy "Admin widzi logi"
  on public.admin_actions_log for select
  using (public.get_my_role() = 'admin');

create policy "Admin tworzy logi"
  on public.admin_actions_log for insert
  with check (public.get_my_role() = 'admin');
