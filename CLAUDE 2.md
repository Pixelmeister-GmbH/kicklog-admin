# kicklog-admin – CLAUDE.md (Projektgedächtnis)

## Was ist kicklog-admin?
Verwaltungspanel für die Kicklog-Plattform. Ermöglicht die zentrale Administration aller Kicklog-Teams, Nutzer, Einladungscodes und Systemdaten — getrennt von der Trainer-App selbst.

**Status:** In Aufbau
**Verhältnis zu Kicklog:** Greift auf dieselbe Supabase-DB zu, jedoch mit erhöhten Admin-Rechten (Service Role Key)
**Live-URL:** (noch nicht deployed)
**GitHub:** (noch nicht angelegt)

---

## Tech-Stack

> Wird beim Setup-Prompt ergänzt.

---

## Projektstruktur

```
kicklog-admin/
├── CLAUDE.md        # Diese Datei — Projektgedächtnis für Claude
├── CHANGELOG.md     # Alle Änderungen chronologisch
└── ...              # Wird beim Setup befüllt
```

---

## Supabase-Verbindung

Teilt die Supabase-Instanz mit Kicklog:
- **Projekt-URL:** `https://uwcvibsysnmcikvylrgp.supabase.co`
- **Projekt-Ref:** `uwcvibsysnmcikvylrgp`
- **Admin-Zugang:** Service Role Key (erhöhte Rechte, bypasses RLS) — nur serverseitig verwenden!
- **Anon Key:** In Kicklog App.jsx Zeile 27

---

## Wichtige Regeln für neue Features

1. **Nach jeder Änderung:** CHANGELOG.md aktualisieren
2. **Vor jeder Codeänderung:** kurz ankündigen was und warum
3. **DB-Änderungen:** SQL dokumentieren + User für Ausführung briefen
4. **Service Role Key niemals client-seitig exponieren**
5. **Nach jeder Änderung pushen** — wir arbeiten immer im Live-System

---

## Offene TODOs

- [ ] Tech-Stack festlegen (folgt per Setup-Prompt)
- [ ] GitHub-Repo anlegen
- [ ] Deployment konfigurieren
- [ ] Admin-Auth absichern (nur autorisierte Admins)
