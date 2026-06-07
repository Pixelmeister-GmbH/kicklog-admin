# TRINITY.md — kicklog-admin (Super-Admin-Panel)

> Handoff/Status. Detailwissen in [`CLAUDE.md`](./CLAUDE.md), Änderungen in [`CHANGELOG.md`](./CHANGELOG.md).

## Was & Wo
- **Rolle:** Super-Admin-Panel der Kicklog-Plattform — Teams, Vereine, Trainer/Profile, Einladungen, Trainingsplan-Bibliothek, Rechnungen, Backups, Feature-Requests. Getrennt von der Trainer-App, **gleiche Supabase-DB**.
- **Live:** https://admin.kicklog.de · **Vercel-Projekt:** `kicklog-admin`, Deploy via GitHub-Action → Vercel bei Push auf `main`.
- **GitHub:** `Pixelmeister-GmbH/kicklog-admin` (Branch `main`).
- **Supabase:** Ref `uwcvibsysnmcikvylrgp` (geteilt mit `klicklog`). Admin-Erkennung: `app_metadata.role === 'super_admin'` im JWT. Privilegierte Ops via Edge Functions + RLS.
- **Stack:** React 19 + Vite 5 + `@supabase/supabase-js`, Paketmanager **bun**, Single-File `src/App.jsx`.

## Stand (07.06.2026)
- Neues Branding (Logo/Favicon, Balken-Bildmarke).
- **Sicherheit:** Service-Role-Key aus dem Client-Bundle entfernt; privilegierte Client-Ops auf RLS umgestellt (`db/2026-06-07_admin_rls_super_admin.sql`). Go-Live-Härtung läuft.
- Repo auf Studio frisch von GitHub geklont (alte Kopie war iCloud-korrupt) — jetzt gesund & deckungsgleich.

## Offene ToDos
- 🔐 **Service-Role-Key ROTIEREN** — war ~18 Tage im Live-Bundle (öffentlich), umgeht RLS = Vollzugriff auf die geteilte DB. Code-Fix ist live, aber der alte Key ist noch gültig. **Vor Go-Live, koordiniert mit der Trainer-App** (`klicklog`).
- Go-Live-Härtung abschließen (RLS-Policies vollständig prüfen, Edge-Function-Abdeckung).

## Deploy / Regeln
- **NIEMALS** einen Service-Role-Key im Client (`VITE_*` landet im Browser-Bundle = öffentlich). Privilegiert → Edge Function oder RLS.
- Push auf `main` → GitHub-Action → Vercel.
- **Nicht in iCloud arbeiten** (Objektschaden-Gefahr) — Repo unter `~/dev`.
