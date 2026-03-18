# Changelog — kicklog-admin

Alle Änderungen chronologisch, neueste zuerst.

---

## [Unreleased]

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
