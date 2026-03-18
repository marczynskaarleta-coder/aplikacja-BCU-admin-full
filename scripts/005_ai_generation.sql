-- ============================================================
-- ETAP 5: Historia generowania pytań przez AI
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.ai_generation_jobs (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid references public.modules(id) on delete set null,
  created_by   uuid references public.profiles(id) on delete set null,
  status       text not null default 'completed'
                 check (status in ('completed','failed')),
  source_text  text,                    -- fragment tekstu który był podstawą
  prompt_used  text,                    -- pełny prompt wysłany do AI
  result_raw   jsonb,                   -- surowa odpowiedź AI
  questions_generated integer default 0,
  questions_saved     integer default 0,
  error_message text,
  created_at   timestamptz not null default now()
);

alter table public.ai_generation_jobs enable row level security;

create policy "AI jobs: zapis i odczyt przez admina"
  on public.ai_generation_jobs for all
  using (public.get_my_role() = 'admin');

create index if not exists idx_ai_jobs_module_id on public.ai_generation_jobs(module_id);
create index if not exists idx_ai_jobs_created_by on public.ai_generation_jobs(created_by);
