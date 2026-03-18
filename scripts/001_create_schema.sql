-- BCU Spedycja E-Learning Platform Database Schema

-- 1. USER PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- 2. MODULES TABLE
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text default 'book',
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.modules enable row level security;

create policy "modules_select_all" on public.modules 
  for select using (true);

-- 3. LESSONS TABLE
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  content text,
  key_points text[],
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.lessons enable row level security;

create policy "lessons_select_all" on public.lessons 
  for select using (true);

-- 4. QUESTIONS TABLE
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  question_text text not null,
  options jsonb not null,
  correct_option_id text not null,
  explanation text,
  difficulty integer default 1,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.questions enable row level security;

create policy "questions_select_all" on public.questions 
  for select using (true);

-- 5. USER PROGRESS TABLE
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, module_id, lesson_id)
);

alter table public.user_progress enable row level security;

create policy "progress_select_own" on public.user_progress 
  for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.user_progress 
  for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.user_progress 
  for update using (auth.uid() = user_id);

-- 6. USER ANSWERS TABLE
create table if not exists public.user_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id text not null,
  is_correct boolean not null,
  attempt_number integer default 1,
  answered_at timestamptz default now()
);

alter table public.user_answers enable row level security;

create policy "answers_select_own" on public.user_answers 
  for select using (auth.uid() = user_id);
create policy "answers_insert_own" on public.user_answers 
  for insert with check (auth.uid() = user_id);

-- 7. REVIEW QUEUE TABLE
create table if not exists public.review_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  wrong_count integer default 1,
  last_wrong_at timestamptz default now(),
  next_review_at timestamptz default now(),
  mastered boolean default false,
  created_at timestamptz default now(),
  unique(user_id, question_id)
);

alter table public.review_queue enable row level security;

create policy "review_select_own" on public.review_queue 
  for select using (auth.uid() = user_id);
create policy "review_insert_own" on public.review_queue 
  for insert with check (auth.uid() = user_id);
create policy "review_update_own" on public.review_queue 
  for update using (auth.uid() = user_id);
create policy "review_delete_own" on public.review_queue 
  for delete using (auth.uid() = user_id);

-- 8. QUIZ SESSIONS TABLE
create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  total_questions integer not null,
  correct_answers integer default 0,
  started_at timestamptz default now(),
  completed_at timestamptz,
  score_percentage decimal(5,2)
);

alter table public.quiz_sessions enable row level security;

create policy "sessions_select_own" on public.quiz_sessions 
  for select using (auth.uid() = user_id);
create policy "sessions_insert_own" on public.quiz_sessions 
  for insert with check (auth.uid() = user_id);
create policy "sessions_update_own" on public.quiz_sessions 
  for update using (auth.uid() = user_id);

-- INDEXES
create index if not exists idx_lessons_module_id on public.lessons(module_id);
create index if not exists idx_questions_module_id on public.questions(module_id);
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
create index if not exists idx_user_answers_user_id on public.user_answers(user_id);
create index if not exists idx_review_queue_user_id on public.review_queue(user_id);
create index if not exists idx_quiz_sessions_user_id on public.quiz_sessions(user_id);

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null),
    coalesce((new.raw_user_meta_data ->> 'is_admin')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
