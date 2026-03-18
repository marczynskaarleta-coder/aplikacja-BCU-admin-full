-- ============================================================
-- ETAP 4: Pytania — migracja do nowego formatu admina
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Dodaj brakujące kolumny do questions
alter table public.questions
  add column if not exists correct_answer  integer,
  add column if not exists created_by      uuid references public.profiles(id) on delete set null;

-- Jeśli dotychczas używałeś correct_option_id (tekst z indexem jako string),
-- przepisz do correct_answer
update public.questions
  set correct_answer = correct_option_id::integer
  where correct_answer is null
    and correct_option_id ~ '^[0-9]+$';

-- 2. Ujednolicenie difficulty: integer → text
-- Dodaj kolumnę difficulty_text i przepisz
alter table public.questions
  add column if not exists difficulty_text text
    check (difficulty_text in ('easy','medium','hard'));

update public.questions set difficulty_text =
  case
    when difficulty = 1 then 'easy'
    when difficulty = 2 then 'medium'
    when difficulty = 3 then 'hard'
    else 'easy'
  end
where difficulty_text is null;

-- 3. RLS dla questions — tylko admin pisze
drop policy if exists "questions_select_all"          on public.questions;
drop policy if exists "Pytania: odczyt"               on public.questions;
drop policy if exists "Pytania: zapis przez admina"   on public.questions;

create policy "Pytania: odczyt"
  on public.questions for select
  to authenticated
  using (is_active = true or public.get_my_role() = 'admin');

create policy "Pytania: zapis przez admina"
  on public.questions for all
  using (public.get_my_role() = 'admin');

-- 4. Indeks
create index if not exists idx_questions_difficulty on public.questions(difficulty_text);
create index if not exists idx_questions_created_by on public.questions(created_by);
