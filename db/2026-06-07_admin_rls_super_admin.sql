-- kicklog-admin — RLS-Policies für Super-Admin (ersetzt den client-seitigen Service-Role-Key)
-- ============================================================================
-- Kontext: Der Admin-Client nutzte bisher den Service-Role-Key (im Browser-Bundle
-- = Leck). Entfernt. Die 3 privilegierten Ops laufen jetzt über die normale
-- Admin-Session (anon key + JWT). Diese Policies erlauben genau diese Ops,
-- wenn der eingeloggte User app_metadata.role = 'super_admin' im JWT hat
-- (gleiche Quelle, die App.jsx beim Login prüft).
--
-- Im Supabase-Dashboard (SQL Editor) des Projekts uwcvibsysnmcikvylrgp ausführen.
-- Idempotent (drop policy if exists vor create).
-- ============================================================================

-- 1) teams: Super-Admin darf updaten (z.B. invoice_created togglen)
drop policy if exists "teams_superadmin_update" on public.teams;
create policy "teams_superadmin_update" on public.teams
  for update to authenticated
  using      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- 2) Storage-Bucket "training-plans": Super-Admin darf PDFs hochladen …
drop policy if exists "training_plans_superadmin_insert" on storage.objects;
create policy "training_plans_superadmin_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'training-plans'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );

-- 3) … und löschen
drop policy if exists "training_plans_superadmin_delete" on storage.objects;
create policy "training_plans_superadmin_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'training-plans'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );

-- Telemetrie
do $$
declare n int;
begin
  select count(*) into n from pg_policies
  where policyname in ('teams_superadmin_update','training_plans_superadmin_insert','training_plans_superadmin_delete');
  raise notice 'Admin-RLS-Policies aktiv: % von 3', n;
end $$;
