-- ============================================================
-- BCU Spedycja - Schemat bazy danych
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. PROFILES (profile użytkownika, tworzone automatycznie)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  first_name  text,
  last_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Automatyczne tworzenie profilu po rejestracji
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. MODULES (moduły edukacyjne)
-- ============================================================
create table if not exists public.modules (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  description       text,
  educational_content text,           -- treść edukacyjna (markdown)
  icon              text default 'BookOpen',
  order_index       integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- 3. LESSONS (lekcje w ramach modułu)
-- ============================================================
create table if not exists public.lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references public.modules(id) on delete cascade,
  title       text not null,
  content     jsonb,                  -- tablica obiektów {type, content}
  key_points  text[],                 -- lista kluczowych punktów
  order_index integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 4. QUESTIONS / QUIZZES (pytania quizowe)
-- ============================================================
create table if not exists public.questions (
  id             uuid primary key default gen_random_uuid(),
  module_id      uuid not null references public.modules(id) on delete cascade,
  lesson_id      uuid references public.lessons(id) on delete set null,
  question_text  text not null,
  options        text[] not null,     -- 4 opcje odpowiedzi
  correct_answer integer not null,    -- indeks poprawnej odpowiedzi (0-3)
  explanation    text,
  difficulty     text not null default 'medium'
                   check (difficulty in ('easy', 'medium', 'hard')),
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ============================================================
-- 5. USER_ANSWERS (odpowiedzi użytkowników)
-- ============================================================
create table if not exists public.user_answers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  question_id     uuid not null references public.questions(id) on delete cascade,
  selected_answer integer not null,
  is_correct      boolean not null,
  needs_review    boolean not null default false,
  answered_at     timestamptz not null default now(),
  unique (user_id, question_id)       -- jedna odpowiedź na pytanie na użytkownika
);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.modules      enable row level security;
alter table public.lessons      enable row level security;
alter table public.questions    enable row level security;
alter table public.user_answers enable row level security;

-- Usunięcie istniejących polityk (bezpieczne przy ponownym uruchomieniu)
drop policy if exists "Użytkownik widzi swój profil"        on public.profiles;
drop policy if exists "Użytkownik edytuje swój profil"      on public.profiles;
drop policy if exists "Zalogowani czytają moduły"           on public.modules;
drop policy if exists "Admin zarządza modułami"             on public.modules;
drop policy if exists "Zalogowani czytają lekcje"           on public.lessons;
drop policy if exists "Admin zarządza lekcjami"             on public.lessons;
drop policy if exists "Zalogowani czytają pytania"          on public.questions;
drop policy if exists "Admin zarządza pytaniami"            on public.questions;
drop policy if exists "Użytkownik widzi swoje odpowiedzi"   on public.user_answers;
drop policy if exists "Użytkownik dodaje swoje odpowiedzi"  on public.user_answers;
drop policy if exists "Użytkownik aktualizuje swoje odpowiedzi" on public.user_answers;
drop policy if exists "Admin widzi wszystkie odpowiedzi"    on public.user_answers;

-- Profiles
create policy "Użytkownik widzi swój profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Użytkownik edytuje swój profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Modules
create policy "Zalogowani czytają moduły"
  on public.modules for select
  to authenticated
  using (is_active = true);

create policy "Admin zarządza modułami"
  on public.modules for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Lessons
create policy "Zalogowani czytają lekcje"
  on public.lessons for select
  to authenticated
  using (is_active = true);

create policy "Admin zarządza lekcjami"
  on public.lessons for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Questions
create policy "Zalogowani czytają pytania"
  on public.questions for select
  to authenticated
  using (is_active = true);

create policy "Admin zarządza pytaniami"
  on public.questions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- User answers
create policy "Użytkownik widzi swoje odpowiedzi"
  on public.user_answers for select
  using (auth.uid() = user_id);

create policy "Użytkownik dodaje swoje odpowiedzi"
  on public.user_answers for insert
  with check (auth.uid() = user_id);

create policy "Użytkownik aktualizuje swoje odpowiedzi"
  on public.user_answers for update
  using (auth.uid() = user_id);

create policy "Admin widzi wszystkie odpowiedzi"
  on public.user_answers for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- 7. DANE STARTOWE (moduły z aplikacji)
-- ============================================================

insert into public.modules (title, description, icon, order_index) values
  ('Dokumenty transportowe',  'Rodzaje i zastosowanie dokumentów w transporcie międzynarodowym', 'FileText',   1),
  ('Incoterms 2020',          'Międzynarodowe reguły handlu i podział odpowiedzialności',         'Globe',      2),
  ('Prawo transportowe',      'Przepisy krajowe i międzynarodowe regulujące transport',           'Scale',      3),
  ('Organizacja przewozu',    'Planowanie tras, optymalizacja i zarządzanie flotą',               'Truck',      4),
  ('Koszty i kalkulacja',     'Kalkulacja stawek przewozowych i analiza kosztów',                 'Calculator', 5),
  ('Bezpieczeństwo i compliance', 'Przepisy BHP, ADR i zgodność z regulacjami',                  'Shield',     6)
on conflict do nothing;
