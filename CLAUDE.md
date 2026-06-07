# kicklog-admin – CLAUDE.md (Projektgedächtnis)

## Was ist kicklog-admin?
Super-Admin-Panel der Kicklog-Plattform (Jugendfußball / Trainer-App). Verwaltet
Teams, Vereine, Trainer/Profile, Einladungen, Trainingsplan-Bibliothek, Rechnungen,
Backups und Feature-Requests — getrennt von der Trainer-App, auf derselben Supabase-DB.

**Status:** Live (Vercel, Production) — Go-Live-Härtung läuft.
**Live:** Vercel-Projekt `kicklog-admin` (Team `pixelmeisters-projects`), Deploy via GitHub-Action → Vercel bei Push auf `main`.
**GitHub:** `Pixelmeister-GmbH/kicklog-admin`.

## Tech-Stack
React 19 + Vite 5 + `@supabase/supabase-js`. Paketmanager **bun**. Eine große
`src/App.jsx` (~2.500 Zeilen). Build: `bun run build` (Vite).

## Supabase
- Projekt-Ref: `uwcvibsysnmcikvylrgp` (geteilt mit der Trainer-App).
- **Auth/Daten:** anon key (public, im Client) + authentifizierte User-Session. RLS greift.
- **Admin-Erkennung:** `app_metadata.role === 'super_admin'` im JWT (kein DB-Lookup).
- **Privilegierte Ops:** über **Edge Functions** (`admin-create-team`, `-delete-team`,
  `-impersonate`, `-add-superadmin`, `-create-club`, `-backup-status`) ODER **RLS-Policies**,
  die `app_metadata.role = 'super_admin'` prüfen.

## 🔒 Sicherheit — HARTE REGEL
**NIEMALS einen Service-Role-Key im Client.** Bei einem Vite-SPA landet jede
`import.meta.env.VITE_*`-Var im Browser-Bundle = öffentlich. Der Service-Role-Key
umgeht RLS (Vollzugriff auf die ganze DB) → er gehört ausschließlich serverseitig
(Edge Functions). Stand 07.06.2026 entfernt (war ~18 Tage im Live-Bundle → Key MUSS
rotiert werden, siehe TODOs). Privilegierte Client-Ops → RLS (`db/2026-06-07_admin_rls_super_admin.sql`)
oder Edge Function.

## Regeln für Änderungen
1. Nach Änderung: CHANGELOG.md aktualisieren.
2. DB-Änderungen als SQL in `db/` dokumentieren + im Supabase-Dashboard/`db push` ausführen.
3. Service-Role-Key niemals client-seitig.
4. Build muss grün sein vor Push (`bun run build`).

## Offene TODOs (Go-Live-Härtung)
- [ ] **🚨 Service-Role-Key rotieren** — war 18 Tage öffentlich. Koordiniert mit der
      Trainer-App (geteilter anon key). Nur über Supabase-Dashboard.
- [ ] RLS-Policies aus `db/2026-06-07_admin_rls_super_admin.sql` in Prod anwenden.
- [ ] Restliche Admin-Auth/RLS-Abdeckung gegen-prüfen (alle Tabellen, die der Admin schreibt).
