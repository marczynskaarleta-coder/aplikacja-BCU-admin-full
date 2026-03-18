-- Dodanie kolumny file_url do tabeli modules
alter table public.modules
  add column if not exists file_url text;

-- Polityki Storage dla bucketu module-files
insert into storage.buckets (id, name, public)
  values ('module-files', 'module-files', true)
  on conflict (id) do nothing;

-- Każdy zalogowany może pobrać pliki
create policy "Zalogowani pobierają pliki modułów"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'module-files');

-- Tylko admin może wgrywać i usuwać pliki
create policy "Admin wgrywa pliki modułów"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'module-files'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admin usuwa pliki modułów"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'module-files'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
