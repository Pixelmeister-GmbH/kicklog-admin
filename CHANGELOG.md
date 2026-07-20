# Changelog — kicklog-admin
## 20.07.2026

- **Vereinsadmin-Onboarding (Phase 3):** Neue Karte „Vereinsadmin (Director-Zugang)" im Club-Detail → Accounts: zeigt Ansprechpartner + letzten Login des club_admin und verschickt per Button einen Magic Link an die Kontakt-E-Mail (OTP, `create_user: false`, Redirect director.kicklog.de). Erst-/Wiedereinladung liegt damit vollständig beim Super-Admin.

Alle Änderungen chronologisch, neueste zuerst.

---

## [Unreleased]

### 2026-05-01 — Fix: „Neuer Super-Admin hinzufügen" Browser-Fehler

- **Bug:** Browser-Fehler „Forbidden use of secret API key in browser" beim Klick auf „Hinzufügen" im Settings → Super-Admins-Block. Code rief `supabaseAdmin.auth.admin.listUsers()` direkt mit Service Role Key auf — von Supabase JS jetzt blockiert
- **Fix:** `addAdmin` ruft jetzt die neue Edge Function `admin-add-superadmin` (im klicklog-Repo unter `supabase/functions/`). Caller-JWT + profiles.role-Check stellen sicher dass nur Super-Admins andere Super-Admins ernennen können. Service Role Key bleibt server-seitig
- Andere Stellen im Admin-Panel (invoice_created-Update, training-plans Storage-Upload/Delete) verwenden weiterhin `supabaseAdmin` — falls Supabase JS die auch blockiert, müssen diese ebenfalls in Edge Functions migriert werden

### 2026-03-18 — Club Onboarding System + Security-Fix

#### Security
- **Impersonate-Fix:** Supabase Service Role Key darf nicht client-seitig für DB-Queries verwendet werden → Edge Function `admin-impersonate` erstellt
- Alle privilegierten Admin-Ops laufen jetzt server-seitig via Edge Functions

#### Neue Edge Functions (klicklog/supabase/functions/)
- `admin-impersonate`: Verifiziert super_admin-Rolle, holt Profil via Service Role Client, generiert Magic Link
- `admin-create-club`: Vollständiges Club-Onboarding — Club anlegen, Club-Admin einladen, Teams + Coaches einladen

#### Neue Features (App.jsx)
- **ClubOnboardingWizard:** 4-Schritt-Modal
  - Schritt 1: Vereinsdaten (Name, Ansprechpartner, E-Mail, Telefon, interne Notiz)
  - Schritt 2: Teams anlegen (dynamisch erweiterbar, je Name + Liga + Trainer-E-Mail)
  - Schritt 3: Zugänge-Vorschau (Club-Admin + Coaches, alle per E-Mail eingeladen)
  - Schritt 4: Bestätigungsscreen mit Ergebnisliste
- **Clubs-Komponente:** Vereinsübersicht mit Suche, Status-Filter (alle/aktiv/trial/inaktiv), Copy-ID, Details-Button
- **ClubDetailModal:** 3-Tab-Modal (Übersicht mit Status/Trial/Teams, Notizen, Zugänge/Profiles)
- **Neuer Nav-Eintrag:** "Vereine (Clubs)" (◎)
- **CTA-Button:** "Neuer Vereinskunde" (grün) oben in der Sidebar
- **Team-ID in Kundenliste:** UUID klickbar zum Kopieren

#### SQL-Migration (ausgeführt)
- `clubs` Tabelle erstellt mit RLS (nur super_admin)
- `profiles.club_id` Spalte hinzugefügt
- `teams.club_id` + `teams.liga` Spalten hinzugefügt
- `admin_notes.club_id` Spalte hinzugefügt
- 4 DB-Indexes angelegt

### 2026-03-18 — Projektstart
- Projektverzeichnis angelegt
- CLAUDE.md und CHANGELOG.md erstellt
