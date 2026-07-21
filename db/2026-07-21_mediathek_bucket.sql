-- kicklog-admin — Storage-Bucket "mediathek" + RLS (Super-Admin-Mediathek)
-- ============================================================================
-- Kontext: Neue Mediathek im Admin-Panel (Ordner + Dateien). Läuft über den
-- authentifizierten Admin-Client (KEIN Service-Role im Browser — Regel aus
-- TRINITY.md). Zugriff nur für app_metadata.role = 'super_admin' im JWT,
-- exakt das Muster aus db/2026-06-07_admin_rls_super_admin.sql (training-plans).
--
-- Im Supabase SQL-Editor (Projekt uwcvibsysnmcikvylrgp) ausführen. Idempotent.
-- ============================================================================

-- 1) Privater Bucket
insert into storage.buckets (id, name, public)
values ('mediathek', 'mediathek', false)
on conflict (id) do nothing;

-- 2) Storage-Policies: Super-Admin darf im mediathek-Bucket lesen/hochladen/
--    ändern (upsert)/löschen. Alles andere (anon, normale User) hat keinen Zugriff.
drop policy if exists "mediathek_superadmin_select" on storage.objects;
create policy "mediathek_superadmin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'mediathek' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

drop policy if exists "mediathek_superadmin_insert" on storage.objects;
create policy "mediathek_superadmin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'mediathek' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

drop policy if exists "mediathek_superadmin_update" on storage.objects;
create policy "mediathek_superadmin_update" on storage.objects
  for update to authenticated
  using      (bucket_id = 'mediathek' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin')
  with check (bucket_id = 'mediathek' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

drop policy if exists "mediathek_superadmin_delete" on storage.objects;
create policy "mediathek_superadmin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'mediathek' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- ============================================================================
-- ROLLBACK:
--   drop policy if exists "mediathek_superadmin_select" on storage.objects;
--   drop policy if exists "mediathek_superadmin_insert" on storage.objects;
--   drop policy if exists "mediathek_superadmin_update" on storage.objects;
--   drop policy if exists "mediathek_superadmin_delete" on storage.objects;
--   delete from storage.buckets where id = 'mediathek';   -- nur wenn leer
-- ============================================================================
