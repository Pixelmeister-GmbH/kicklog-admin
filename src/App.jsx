import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================
// Supabase Setup
// ============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
// Anon key is public — used only for auth (signIn/signOut/session)
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y3ZpYnN5c25tY2lrdnlscmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDQ4NTAsImV4cCI6MjA4ODk4MDg1MH0.rUUH4_G8oV5CtyIKvihok9rTQcdcGBMpswy8TBugqZY";

// Auth client — anon key for login/logout
const supabase = createClient(SUPABASE_URL, ANON_KEY);
// Admin client — service role key for admin operations (bypasses RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================
// Design System
// ============================================
const c = {
  bg: "#0f0f0f",
  sidebar: "#141414",
  surface: "#1e1e1e",
  surfaceHover: "#252525",
  border: "#2a2a2a",
  accent: "#22c55e",
  accentDim: "#22c55e22",
  danger: "#ef4444",
  dangerDim: "#ef444422",
  warn: "#f59e0b",
  warnDim: "#f59e0b22",
  info: "#3b82f6",
  infoDim: "#3b82f622",
  text: "#e5e5e5",
  textDim: "#888",
  textMuted: "#555",
};

const baseBtn = {
  border: "none", cursor: "pointer", borderRadius: 6, fontSize: 12,
  fontWeight: 600, padding: "7px 14px", transition: "opacity 0.15s",
  fontFamily: "inherit",
};
const inputStyle = {
  width: "100%", background: c.bg, border: `1px solid ${c.border}`,
  borderRadius: 6, color: c.text, padding: "8px 10px", fontSize: 13,
  fontFamily: "inherit", outline: "none",
};

// ============================================
// Logo
// ============================================
function Logo({ size = 24 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke={c.accent} strokeWidth="4" fill="#141414" />
        <polygon points="50,22 61,38 57,55 43,55 39,38" fill={c.accent} opacity="0.9" />
        <polygon points="61,38 78,38 75,55 57,55" fill={c.accent} opacity="0.7" />
        <polygon points="39,38 22,38 25,55 43,55" fill={c.accent} opacity="0.7" />
        <polygon points="43,55 35,72 50,78 65,72 57,55" fill={c.accent} opacity="0.5" />
      </svg>
      <span style={{ fontWeight: 800, fontSize: size * 0.75, letterSpacing: -0.5, color: c.text }}>
        Kicklog <span style={{ color: c.accent, fontSize: size * 0.55, fontWeight: 700 }}>ADMIN</span>
      </span>
    </span>
  );
}

// ============================================
// Shared UI Components
// ============================================
function Card({ children, style }) {
  return (
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 10, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function Badge({ label, color = c.accent }) {
  return (
    <span style={{ background: color + "22", color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function Modal({ title, onClose, children, width = 680 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: `1px solid ${c.border}` }}>
          <span style={{ color: c.text, fontWeight: 700, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{ ...baseBtn, background: "transparent", color: c.textDim, padding: "2px 8px", fontSize: 18 }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${c.border}`, marginBottom: 20 }}>
      {tabs.map((t) => (
        <button key={t.key} onClick={() => onChange(t.key)}
          style={{ ...baseBtn, background: "transparent", color: active === t.key ? c.accent : c.textDim, borderBottom: active === t.key ? `2px solid ${c.accent}` : "2px solid transparent", borderRadius: 0, padding: "8px 16px", fontSize: 13 }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, color = c.accent }) {
  return (
    <Card>
      <div style={{ color: c.textDim, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{label}</div>
      <div style={{ color, fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>{value ?? "—"}</div>
      {sub && <div style={{ color: c.textDim, fontSize: 11 }}>{sub}</div>}
    </Card>
  );
}

const planColor = (plan) => plan === "club" ? c.info : c.accent;
const statusColor = (s) => s === "active" ? c.accent : s === "trial" ? c.warn : c.danger;
const statusLabel = (s) => s === "active" ? "Aktiv" : s === "trial" ? "Trial" : "Gesperrt";
const planLabel = (p) => p === "club" ? "Club" : "Team";
const priorityColor = (p) => p === "high" ? c.danger : p === "medium" ? c.warn : c.textDim;
const priorityLabel = (p) => p === "high" ? "Hoch" : p === "medium" ? "Mittel" : "Niedrig";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
const fmtDateTime = (d) => d ? new Date(d).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const daysUntil = (d) => d ? Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24)) : null;

// ============================================
// Login Screen
// ============================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      // Check role from app_metadata (set by admin, no DB query needed)
      const role = data.user?.app_metadata?.role;
      if (role !== "super_admin") {
        await supabase.auth.signOut();
        setError("Kein Zugriff. Nur Super-Admins können sich hier einloggen.");
        setLoading(false); return;
      }
      const profile = { role, vorname: data.user.user_metadata?.vorname || "", nachname: data.user.user_metadata?.nachname || "" };
      onLogin(data.user, profile);
    } catch (err) {
      setError(err.message || "Login fehlgeschlagen.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Logo size={36} />
          <div style={{ color: c.textDim, fontSize: 13, marginTop: 8 }}>Internes Verwaltungspanel</div>
        </div>
        <Card>
          <form onSubmit={login}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>E-Mail</label>
              <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kicklog.de" autoFocus required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Passwort</label>
              <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div style={{ background: c.dangerDim, border: `1px solid ${c.danger}33`, borderRadius: 6, padding: "10px 12px", color: c.danger, fontSize: 12, marginBottom: 14 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ ...baseBtn, width: "100%", background: c.accent, color: "#000", padding: "10px", fontSize: 14 }}>
              {loading ? "Einloggen..." : "Einloggen"}
            </button>
          </form>
        </Card>
        <div style={{ color: c.textMuted, fontSize: 11, textAlign: "center", marginTop: 16 }}>
          Nur autorisierte Super-Admins haben Zugriff.
        </div>
      </div>
    </div>
  );
}

// ============================================
// Customer Detail Modal
// ============================================
function CustomerDetailModal({ team, onClose, onUpdate }) {
  const [tab, setTab] = useState("overview");
  const [plan, setPlan] = useState(team.plan || "team");
  const [status, setStatus] = useState(team.plan_status || "trial");
  const [trialEnds, setTrialEnds] = useState(team.trial_ends_at ? team.trial_ends_at.substring(0, 10) : "");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [flags, setFlags] = useState({});
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ players: 0, matches: 0, trainings: 0, members: 0 });

  const FEATURES = [
    { key: "scouting", label: "Scouting" },
    { key: "leistungstest", label: "Leistungsdiagnostik" },
    { key: "multi_team", label: "Multi-Team" },
    { key: "export_csv", label: "CSV-Export" },
    { key: "gegner_scouting", label: "Gegner-Scouting" },
    { key: "onboarding", label: "Spieler-Onboarding" },
  ];

  useEffect(() => {
    loadData();
  }, [team.id]);

  const loadData = async () => {
    const [p, m, t, mb, notesRes, flagsRes, reqRes] = await Promise.all([
      supabase.from("players").select("id", { count: "exact", head: true }).eq("team_id", team.id),
      supabase.from("matches").select("id", { count: "exact", head: true }).eq("team_id", team.id),
      supabase.from("trainings").select("id", { count: "exact", head: true }).eq("team_id", team.id),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("team_id", team.id),
      supabase.from("admin_notes").select("*").eq("team_id", team.id).order("created_at", { ascending: false }),
      supabase.from("feature_flags").select("*").eq("team_id", team.id),
      supabase.from("feature_requests").select("*").eq("team_id", team.id).order("created_at", { ascending: false }),
    ]);
    setStats({ players: p.count || 0, matches: m.count || 0, trainings: t.count || 0, members: mb.count || 0 });
    setNotes(notesRes.data || []);
    const flagMap = {};
    FEATURES.forEach((f) => { flagMap[f.key] = false; });
    (flagsRes.data || []).forEach((f) => { flagMap[f.feature_key] = f.enabled; });
    setFlags(flagMap);
    setRequests(reqRes.data || []);
  };

  const saveOverview = async () => {
    setSaving(true);
    const body = { plan, plan_status: status, trial_ends_at: trialEnds || null };
    if (status === "suspended") body.invoice_created = false;
    await supabase.from("teams").update(body).eq("id", team.id);
    onUpdate({ ...team, ...body });
    setSaving(false);
  };

  const extendTrial = async (days) => {
    const base = trialEnds ? new Date(trialEnds) : new Date();
    base.setDate(base.getDate() + days);
    const newDate = base.toISOString().substring(0, 10);
    setTrialEnds(newDate);
    await supabase.from("teams").update({ trial_ends_at: newDate }).eq("id", team.id);
    onUpdate({ ...team, trial_ends_at: newDate });
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { data } = await supabase.from("admin_notes").insert({ team_id: team.id, note: newNote.trim() }).select().single();
    if (data) setNotes([data, ...notes]);
    setNewNote("");
  };

  const toggleFlag = async (key, current) => {
    const newVal = !current;
    setFlags({ ...flags, [key]: newVal });
    const { data: existing } = await supabase.from("feature_flags").select("id").eq("team_id", team.id).eq("feature_key", key).maybeSingle();
    if (existing) {
      await supabase.from("feature_flags").update({ enabled: newVal }).eq("id", existing.id);
    } else {
      await supabase.from("feature_flags").insert({ team_id: team.id, feature_key: key, enabled: newVal });
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    await supabase.from("feature_requests").update({ status: newStatus }).eq("id", id);
    setRequests(requests.map((r) => r.id === id ? { ...r, status: newStatus } : r));
  };

  const days = daysUntil(team.trial_ends_at);

  return (
    <Modal title={`${team.name}`} onClose={onClose} width={760}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Badge label={planLabel(team.plan)} color={planColor(team.plan)} />
        <Badge label={statusLabel(team.plan_status)} color={statusColor(team.plan_status)} />
        {days !== null && days <= 14 && <Badge label={`Trial: ${days}d`} color={days <= 3 ? c.danger : c.warn} />}
        <span style={{ color: c.textDim, fontSize: 12, marginLeft: "auto" }}>Seit {fmtDate(team.created_at)}</span>
      </div>

      <Tabs
        tabs={[
          { key: "overview", label: "Übersicht" },
          { key: "notes", label: `Notizen (${notes.length})` },
          { key: "flags", label: "Feature Flags" },
          { key: "requests", label: `Requests (${requests.length})` },
        ]}
        active={tab} onChange={setTab}
      />

      {tab === "overview" && (
        <div>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Spieler", val: stats.players },
              { label: "Spiele", val: stats.matches },
              { label: "Trainings", val: stats.trainings },
              { label: "Trainer", val: stats.members },
            ].map((s) => (
              <div key={s.label} style={{ background: c.bg, borderRadius: 8, padding: "12px 14px", border: `1px solid ${c.border}`, textAlign: "center" }}>
                <div style={{ color: c.accent, fontSize: 22, fontWeight: 800 }}>{s.val}</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Plan & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Plan</label>
              <select style={inputStyle} value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="team">Team</option>
                <option value="club">Club</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Status</label>
              <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="trial">Trial</option>
                <option value="active">Aktiv</option>
                <option value="suspended">Gesperrt</option>
              </select>
            </div>
          </div>

          {/* Trial end */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Trial Ende</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input style={{ ...inputStyle, flex: 1 }} type="date" value={trialEnds} onChange={(e) => setTrialEnds(e.target.value)} />
              {[7, 14, 30].map((d) => (
                <button key={d} onClick={() => extendTrial(d)} style={{ ...baseBtn, background: c.warnDim, color: c.warn, whiteSpace: "nowrap" }}>+{d}d</button>
              ))}
            </div>
          </div>

          <button onClick={saveOverview} disabled={saving} style={{ ...baseBtn, background: c.accent, color: "#000", fontWeight: 700, padding: "9px 20px" }}>
            {saving ? "Speichern..." : "Änderungen speichern"}
          </button>
        </div>
      )}

      {tab === "notes" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)}
              placeholder="Neue Admin-Notiz..."
              style={{ ...inputStyle, minHeight: 72, resize: "vertical", flex: 1 }} />
            <button onClick={addNote} style={{ ...baseBtn, background: c.accent, color: "#000", alignSelf: "flex-start", whiteSpace: "nowrap" }}>Hinzufügen</button>
          </div>
          {notes.length === 0 && <div style={{ color: c.textDim, fontSize: 13, textAlign: "center", padding: 24 }}>Noch keine Notizen.</div>}
          {notes.map((n) => (
            <div key={n.id} style={{ borderBottom: `1px solid ${c.border}`, padding: "10px 0" }}>
              <div style={{ color: c.textDim, fontSize: 11, marginBottom: 4 }}>{fmtDateTime(n.created_at)}</div>
              <div style={{ color: c.text, fontSize: 13, lineHeight: 1.5 }}>{n.note}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "flags" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FEATURES.map((f) => (
            <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: c.bg, borderRadius: 8, padding: "12px 16px", border: `1px solid ${c.border}` }}>
              <div>
                <div style={{ color: c.text, fontWeight: 600, fontSize: 13 }}>{f.label}</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>{f.key}</div>
              </div>
              <div onClick={() => toggleFlag(f.key, flags[f.key])}
                style={{ width: 44, height: 24, borderRadius: 12, background: flags[f.key] ? c.accent : c.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 3, left: flags[f.key] ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "requests" && (
        <div>
          {requests.length === 0 && <div style={{ color: c.textDim, fontSize: 13, textAlign: "center", padding: 24 }}>Keine Feature-Requests.</div>}
          {requests.map((r) => (
            <div key={r.id} style={{ borderBottom: `1px solid ${c.border}`, padding: "12px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: c.text, fontWeight: 600, fontSize: 13, flex: 1 }}>{r.title}</span>
                <Badge label={priorityLabel(r.priority)} color={priorityColor(r.priority)} />
                <select value={r.status} onChange={(e) => updateRequestStatus(r.id, e.target.value)}
                  style={{ ...inputStyle, width: "auto", padding: "3px 8px", fontSize: 11 }}>
                  {["open", "planned", "in_progress", "done", "rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {r.description && <div style={{ color: c.textDim, fontSize: 12 }}>{r.description}</div>}
              <div style={{ color: c.textMuted, fontSize: 11, marginTop: 4 }}>{fmtDate(r.created_at)} · {r.votes} Vote{r.votes !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ============================================
// Dashboard
// ============================================
function Dashboard({ teams, onNavigate }) {
  const total = teams.length;
  const active = teams.filter((t) => t.plan_status === "active").length;
  const trials = teams.filter((t) => t.plan_status === "trial").length;
  const expiringSoon = teams.filter((t) => { const d = daysUntil(t.trial_ends_at); return d !== null && d <= 7 && d >= 0; }).length;
  const [openRequests, setOpenRequests] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("feature_requests").select("*, teams(name)").eq("status", "offen").order("created_at", { ascending: false }).limit(5);
      setOpenRequests(data || []);
    })();
  }, []);

  const newest = [...teams].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
  const expiring = teams.filter((t) => { const d = daysUntil(t.trial_ends_at); return d !== null && d <= 14 && d >= 0; }).sort((a, b) => new Date(a.trial_ends_at) - new Date(b.trial_ends_at));

  return (
    <div>
      <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Gesamt Kunden" value={total} sub="Teams & Clubs" />
        <StatCard label="Aktiv" value={active} sub="plan_status = active" color={c.accent} />
        <StatCard label="Trials" value={trials} sub="Noch nicht konvertiert" color={c.warn} />
        <StatCard label="Ablauf in 7 Tagen" value={expiringSoon} sub="Trial-Ablauf" color={expiringSoon > 0 ? c.danger : c.textDim} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Neueste Anmeldungen</div>
          {newest.length === 0 && <div style={{ color: c.textDim, fontSize: 13 }}>Keine Daten.</div>}
          {newest.map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${c.border}22` }}>
              <div>
                <div style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>{t.saison || "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge label={planLabel(t.plan)} color={planColor(t.plan)} />
                <div style={{ color: c.textDim, fontSize: 11, marginTop: 3 }}>{fmtDate(t.created_at)}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Trials die bald ablaufen</div>
          {expiring.length === 0 && <div style={{ color: c.accent, fontSize: 13 }}>Keine Trials laufen in den nächsten 14 Tagen ab.</div>}
          {expiring.map((t) => {
            const d = daysUntil(t.trial_ends_at);
            return (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${c.border}22` }}>
                <div style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: d <= 3 ? c.danger : c.warn, fontWeight: 700, fontSize: 13 }}>
                    {d === 0 ? "Heute!" : `${d} Tag${d !== 1 ? "e" : ""}`}
                  </span>
                  <div style={{ color: c.textDim, fontSize: 11 }}>{fmtDate(t.trial_ends_at)}</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Feature Requests */}
      {openRequests.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Offene Feature Requests ({openRequests.length})</div>
            <button onClick={() => onNavigate("requests")} style={{ ...baseBtn, background: c.infoDim, color: c.info, border: `1px solid ${c.info}33`, fontSize: 11 }}>Alle anzeigen</button>
          </div>
          {openRequests.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${c.border}22` }}>
              <div>
                <div style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                {r.description && <div style={{ color: c.textDim, fontSize: 11 }}>{r.description.substring(0, 80)}{r.description.length > 80 ? "..." : ""}</div>}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                {r.teams?.name && <div style={{ color: c.textMuted, fontSize: 11 }}>{r.teams.name}</div>}
                <div style={{ color: c.textDim, fontSize: 10 }}>{fmtDate(r.created_at)}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ============================================
// Customers List
// ============================================
function CreateTeamModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [saison, setSaison] = useState("2025/2026");
  const [liga, setLiga] = useState("");
  const [plan, setPlan] = useState("team");
  const [status, setStatus] = useState("trial");
  const [trialMonths, setTrialMonths] = useState(12);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { alert("Teamname ist Pflicht."); return; }
    if (email && !password) { alert("Bitte Passwort eingeben."); return; }
    if (password && !email) { alert("Bitte E-Mail eingeben."); return; }
    setSaving(true);

    const trialEnd = new Date();
    trialEnd.setMonth(trialEnd.getMonth() + trialMonths);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { alert("Nicht eingeloggt."); setSaving(false); return; }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-create-team`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        saison: saison.trim() || null,
        liga: liga.trim() || null,
        plan,
        plan_status: status,
        trial_ends_at: status === "trial" ? trialEnd.toISOString() : null,
        email: email.trim() || null,
        password: password || null,
      }),
    });
    const json = await res.json();
    if (!res.ok || json.error) { alert("Fehler: " + (json.error || res.statusText)); setSaving(false); return; }
    onCreate(json.team);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, width: 440, padding: 28 }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: c.text, fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Neues Team anlegen</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Teamname *</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. U15 FC Beispiel" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Saison</label>
              <input style={inputStyle} value={saison} onChange={(e) => setSaison(e.target.value)} placeholder="2025/2026" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Liga</label>
              <input style={inputStyle} value={liga} onChange={(e) => setLiga(e.target.value)} placeholder="z.B. Kreisliga A" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Plan</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="team">Team</option>
                <option value="club">Club</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Status</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="trial">Trial</option>
                <option value="active">Aktiv</option>
              </select>
            </div>
          </div>
          {status === "trial" && (
            <div>
              <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Trial-Dauer (Monate)</label>
              <input style={{ ...inputStyle, width: 100 }} type="number" min={1} max={24} value={trialMonths} onChange={(e) => setTrialMonths(Number(e.target.value))} />
            </div>
          )}

          <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 14, marginTop: 4 }}>
            <span style={{ color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 8, display: "block" }}>Trainer-Zugang (optional)</span>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>E-Mail</label>
                <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trainer@verein.de" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: c.textDim, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 4 }}>Passwort</label>
                <input style={inputStyle} type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sicheres Passwort" />
              </div>
            </div>
            <span style={{ color: c.textMuted, fontSize: 10, marginTop: 4, display: "block" }}>User wird sofort erstellt und dem Team zugewiesen. Zugangsdaten an den Kunden weiterleiten.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{ ...baseBtn, background: c.surface, color: c.textDim, border: `1px solid ${c.border}` }}>Abbrechen</button>
          <button onClick={save} disabled={saving} style={{ ...baseBtn, background: c.accent, color: "#000" }}>{saving ? "Wird erstellt..." : "Team erstellen"}</button>
        </div>
      </div>
    </div>
  );
}

function Customers({ teams, onUpdate, onCreateTeam, onDeleteTeam }) {
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = teams.filter((t) => {
    if (planFilter !== "all" && t.plan !== planFilter) return false;
    if (statusFilter !== "all" && t.plan_status !== statusFilter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteTeam = async (t) => {
    if (!confirm(`Team "${t.name}" wirklich KOMPLETT löschen?\n\nAlle Spieler, Spiele, Trainings, Scouting und User werden unwiderruflich gelöscht!`)) return;
    if (!confirm(`LETZTE WARNUNG: "${t.name}" und alle Daten endgültig löschen?`)) return;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { alert("Nicht eingeloggt."); return; }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-delete-team`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: t.id }),
    });
    const json = await res.json();
    if (!res.ok || json.error) { alert("Fehler: " + (json.error || res.statusText)); return; }
    onDeleteTeam(t.id);
    alert(`Team "${t.name}" gelöscht.\n\n${json.deleted.users} User, ${json.deleted.players} Spieler, ${json.deleted.matches} Spiele, ${json.deleted.trainings} Trainings entfernt.`);
  };

  const toggleInvoice = async (t) => {
    const newVal = !t.invoice_created;
    await supabaseAdmin.from("teams").update({ invoice_created: newVal }).eq("id", t.id);
    onUpdate({ ...t, invoice_created: newVal });
  };

  const impersonate = async (teamId) => {
    // Edge Function server-side — bypasses "Forbidden use of secret API key in browser"
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { alert("Nicht eingeloggt."); return; }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-impersonate`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    });
    const json = await res.json();
    if (!res.ok || json.error) { alert("Fehler: " + (json.error || res.statusText)); return; }
    window.open(json.link, "_blank");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700 }}>Kunden ({filtered.length})</h2>
        <button onClick={() => setShowCreateModal(true)} style={{ ...baseBtn, background: c.accent, color: "#000", fontSize: 13 }}>+ Neues Team</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, width: 220 }} placeholder="Name suchen..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "team", "club"].map((p) => (
            <button key={p} onClick={() => setPlanFilter(p)}
              style={{ ...baseBtn, background: planFilter === p ? c.accentDim : c.surface, color: planFilter === p ? c.accent : c.textDim, border: `1px solid ${planFilter === p ? c.accent + "44" : c.border}` }}>
              {p === "all" ? "Alle Pläne" : planLabel(p)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "trial", "active", "suspended"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ ...baseBtn, background: statusFilter === s ? statusColor(s) + "22" : c.surface, color: statusFilter === s ? statusColor(s) : c.textDim, border: `1px solid ${statusFilter === s ? statusColor(s) + "44" : c.border}` }}>
              {s === "all" ? "Alle Status" : statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 100px 110px 110px 110px 260px", gap: 0 }}>
          {/* Header */}
          {["Name", "Plan", "Status", "Erstellt", "Trial Ende", "Rechnung", "Aktionen"].map((h) => (
            <div key={h} style={{ color: c.textDim, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, padding: "10px 16px", borderBottom: `1px solid ${c.border}` }}>{h}</div>
          ))}
          {/* Rows */}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: 24, color: c.textDim, textAlign: "center", fontSize: 13 }}>Keine Kunden gefunden.</div>
          )}
          {filtered.map((t) => {
            const days = daysUntil(t.trial_ends_at);
            return [
              <div key={`${t.id}-name`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ color: c.text, fontWeight: 600, fontSize: 13 }}>{t.name}</span>
                <span style={{ color: c.textDim, fontSize: 11 }}>{t.saison || "—"}</span>
                <span
                  title="Klicken zum Kopieren"
                  onClick={() => navigator.clipboard.writeText(t.id)}
                  style={{ color: c.textMuted, fontSize: 10, fontFamily: "monospace", cursor: "pointer", marginTop: 2 }}
                >{t.id}</span>
                {(t.members || []).length > 0 && (
                  <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                    {t.members.map((m) => (
                      <span key={m.id} style={{ fontSize: 10, color: c.textDim }}>
                        <span style={{ color: c.accent, marginRight: 4 }}>●</span>
                        {m.vorname} {m.nachname} — <span style={{ color: c.textMuted }}>{m.funktion || "—"}</span> — <span style={{ color: c.info, cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(m.email)} title="Klicken zum Kopieren">{m.email}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>,
              <div key={`${t.id}-plan`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center" }}>
                <Badge label={planLabel(t.plan)} color={planColor(t.plan)} />
              </div>,
              <div key={`${t.id}-status`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center" }}>
                <Badge label={statusLabel(t.plan_status)} color={statusColor(t.plan_status)} />
              </div>,
              <div key={`${t.id}-created`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center", color: c.textDim, fontSize: 12 }}>
                {fmtDate(t.created_at)}
              </div>,
              <div key={`${t.id}-trial`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center" }}>
                {t.trial_ends_at ? (
                  <span style={{ color: days !== null && days <= 7 ? (days <= 3 ? c.danger : c.warn) : c.textDim, fontSize: 12, fontWeight: days !== null && days <= 7 ? 700 : 400 }}>
                    {fmtDate(t.trial_ends_at)}{days !== null && days <= 14 ? ` (${days}d)` : ""}
                  </span>
                ) : <span style={{ color: c.textMuted, fontSize: 12 }}>—</span>}
              </div>,
              <div key={`${t.id}-invoice`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => toggleInvoice(t)}
                  title={t.invoice_created ? "Rechnung erstellt — klicken zum Zurücksetzen" : "Rechnung noch nicht erstellt — klicken zum Bestätigen"}
                  style={{
                    ...baseBtn,
                    background: t.invoice_created ? c.accentDim : c.surface,
                    color: t.invoice_created ? c.accent : c.textMuted,
                    border: `1px solid ${t.invoice_created ? c.accent + "44" : c.border}`,
                    fontSize: 11,
                    padding: "5px 10px",
                  }}>
                  {t.invoice_created ? "✓ Erstellt" : "— Offen"}
                </button>
              </div>,
              <div key={`${t.id}-actions`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setSelectedTeam(t)} style={{ ...baseBtn, flex: 1, textAlign: "center", background: c.accentDim, color: c.accent, border: `1px solid ${c.accent}33` }}>Details</button>
                <button onClick={() => impersonate(t.id)} style={{ ...baseBtn, flex: 1, textAlign: "center", background: c.infoDim, color: c.info, border: `1px solid ${c.info}33` }}>Login</button>
                <button onClick={() => deleteTeam(t)} style={{ ...baseBtn, flex: 1, textAlign: "center", background: c.dangerDim, color: c.danger, border: `1px solid ${c.danger}33` }}>Löschen</button>
              </div>,
            ];
          })}
        </div>
      </Card>

      {selectedTeam && (
        <CustomerDetailModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onUpdate={(updated) => { onUpdate(updated); setSelectedTeam(updated); }}
        />
      )}

      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newTeam) => onCreateTeam(newTeam)}
        />
      )}
    </div>
  );
}

// ============================================
// Feature Requests (Kanban)
// ============================================
function FeatureRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", description: "", priority: "medium", status: "offen" });
  const [dragId, setDragId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const COLUMNS = [
    { key: "offen", label: "Offen", color: c.textDim },
    { key: "geplant", label: "Geplant", color: c.info },
    { key: "in_arbeit", label: "In Arbeit", color: c.warn },
    { key: "erledigt", label: "Erledigt", color: c.accent },
    { key: "abgelehnt", label: "Abgelehnt", color: c.danger },
  ];

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data } = await supabase.from("feature_requests").select("*, teams(name)").order("created_at", { ascending: false });
    // Enrich with creator name + email via RPC (service role can query auth.users)
    const creatorIds = [...new Set((data || []).map((r) => r.created_by).filter(Boolean))];
    let creatorMap = {};
    if (creatorIds.length) {
      try {
        const idList = creatorIds.map((id) => `'${id}'`).join(",");
        const { data: { session: s } } = await supabase.auth.getSession();
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_creators`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${s?.access_token || ANON_KEY}` },
          body: JSON.stringify({ creator_ids: creatorIds }),
        });
        if (res.ok) {
          const creators = await res.json();
          creators.forEach((cr) => { creatorMap[cr.id] = { name: `${cr.vorname || ""} ${cr.nachname || ""}`.trim(), email: cr.email }; });
        }
      } catch (e) { /* silent */ }
    }
    setRequests((data || []).map((r) => ({ ...r, creatorName: creatorMap[r.created_by]?.name || null, creatorEmail: creatorMap[r.created_by]?.email || null })));
    setLoading(false);
  };

  const changeStatus = async (id, newStatus) => {
    await supabase.from("feature_requests").update({ status: newStatus }).eq("id", id);
    setRequests(requests.map((r) => r.id === id ? { ...r, status: newStatus } : r));
  };

  const deleteRequest = async (id) => {
    if (!confirm("Feature Request löschen?")) return;
    await supabase.from("feature_requests").delete().eq("id", id);
    setRequests(requests.filter((r) => r.id !== id));
  };

  const createRequest = async () => {
    if (!newForm.title.trim()) return;
    const { data } = await supabase.from("feature_requests").insert(newForm).select().single();
    if (data) setRequests([data, ...requests]);
    setNewForm({ title: "", description: "", priority: "medium", status: "offen" });
    setShowNew(false);
  };

  if (loading) return <div style={{ color: c.textDim, padding: 40, textAlign: "center" }}>Lädt...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700 }}>Feature Requests ({requests.length})</h2>
        <button onClick={() => setShowNew(true)} style={{ ...baseBtn, background: c.accent, color: "#000" }}>+ Neue Anfrage</button>
      </div>

      {/* Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, overflowX: "auto" }}>
        {COLUMNS.map((col) => {
          const colItems = requests.filter((r) => r.status === col.key);
          return (
            <div key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (dragId) changeStatus(dragId, col.key); setDragId(null); }}
              style={{ background: c.bg, borderRadius: 10, border: `1px solid ${c.border}`, minHeight: 200 }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: col.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{col.label}</span>
                <span style={{ background: col.color + "22", color: col.color, fontSize: 11, fontWeight: 700, borderRadius: 10, padding: "1px 8px" }}>{colItems.length}</span>
              </div>
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                {colItems.map((r) => (
                  <div key={r.id} draggable
                    onDragStart={() => setDragId(r.id)}
                    onClick={() => setSelectedRequest(r)}
                    style={{ background: c.surface, borderRadius: 8, padding: "10px 12px", border: `1px solid ${c.border}`, cursor: "pointer" }}>
                    <div style={{ color: c.text, fontSize: 12, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{r.title}</div>
                    {r.description && <div style={{ color: c.textDim, fontSize: 11, marginBottom: 6, lineHeight: 1.4 }}>{r.description.substring(0, 80)}{r.description.length > 80 ? "..." : ""}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: r.teams?.name ? c.accent + "22" : c.info + "22", color: r.teams?.name ? c.accent : c.info }}>{r.teams?.name || "👑 Kicklog King"}</span>
                        {r.creatorName && <div style={{ color: c.textDim, fontSize: 10, marginTop: 2 }}>{r.creatorName}</div>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteRequest(r.id); }} style={{ ...baseBtn, background: "transparent", color: c.danger, fontSize: 10, padding: "2px 6px", border: "none" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedRequest && (
        <Modal title="Feature Request bearbeiten" onClose={() => setSelectedRequest(null)} width={520}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Titel</label>
            <input style={{ ...inputStyle }} value={selectedRequest.title || ""} onChange={(e) => setSelectedRequest({ ...selectedRequest, title: e.target.value })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Beschreibung</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={selectedRequest.description || ""} onChange={(e) => setSelectedRequest({ ...selectedRequest, description: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16, padding: "12px 0", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
            {selectedRequest.teams?.name && <div><span style={{ color: c.textDim, fontSize: 10 }}>Team</span><div style={{ color: c.text, fontSize: 12, fontWeight: 600 }}>{selectedRequest.teams.name}</div></div>}
            {selectedRequest.creatorName && <div><span style={{ color: c.textDim, fontSize: 10 }}>Von</span><div style={{ color: c.text, fontSize: 12, fontWeight: 600 }}>{selectedRequest.creatorName}</div></div>}
            {selectedRequest.creatorEmail && <div><span style={{ color: c.textDim, fontSize: 10 }}>E-Mail</span><div style={{ color: c.info, fontSize: 12 }}>{selectedRequest.creatorEmail}</div></div>}
            <div><span style={{ color: c.textDim, fontSize: 10 }}>Datum</span><div style={{ color: c.text, fontSize: 12 }}>{selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleDateString("de-DE") : "—"}</div></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {Object.entries(COLUMNS.reduce((a, col) => ({ ...a, [col.key]: col }), {})).map(([key, col]) => (
              <button key={key} onClick={() => { changeStatus(selectedRequest.id, key); setSelectedRequest({ ...selectedRequest, status: key }); }}
                style={{ ...baseBtn, flex: 1, textAlign: "center", background: selectedRequest.status === key ? col.color + "22" : c.surface, color: selectedRequest.status === key ? col.color : c.textDim, border: `1px solid ${selectedRequest.status === key ? col.color + "44" : c.border}`, fontSize: 11 }}>
                {col.label}
              </button>
            ))}
          </div>
          <button onClick={async () => {
            await supabase.from("feature_requests").update({ title: selectedRequest.title, description: selectedRequest.description }).eq("id", selectedRequest.id);
            setRequests(requests.map((r) => r.id === selectedRequest.id ? { ...r, title: selectedRequest.title, description: selectedRequest.description } : r));
            setSelectedRequest(null);
          }} style={{ ...baseBtn, background: c.accent, color: "#000", width: "100%" }}>Speichern</button>
        </Modal>
      )}

      {showNew && (
        <Modal title="Neue Feature-Anfrage" onClose={() => setShowNew(false)} width={480}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Titel *</label>
              <input style={inputStyle} value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} autoFocus />
            </div>
            <div>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Beschreibung</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Priorität</label>
                <select style={inputStyle} value={newForm.priority} onChange={(e) => setNewForm({ ...newForm, priority: e.target.value })}>
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Status</label>
                <select style={inputStyle} value={newForm.status} onChange={(e) => setNewForm({ ...newForm, status: e.target.value })}>
                  <option value="open">Offen</option>
                  <option value="planned">Geplant</option>
                  <option value="in_progress">In Arbeit</option>
                </select>
              </div>
            </div>
            <button onClick={createRequest} style={{ ...baseBtn, background: c.accent, color: "#000", fontWeight: 700, padding: "9px 20px", marginTop: 4 }}>Anfrage erstellen</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// Settings
// ============================================
function Settings({ currentUser }) {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");
  const [googleKey, setGoogleKey] = useState("");
  const [googleKeySaved, setGoogleKeySaved] = useState(false);

  useEffect(() => {
    loadAdmins();
    (async () => {
      const { data } = await supabase.from("app_settings").select("value").eq("key", "google_places_api_key").single();
      if (data?.value) setGoogleKey(data.value);
    })();
  }, []);

  const loadAdmins = async () => {
    const { data } = await supabase.from("profiles").select("id, vorname, nachname").eq("role", "super_admin");
    setAdmins(data || []);
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    setAdding(true); setMsg("");
    const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) { setMsg("Fehler: " + listErr.message); setAdding(false); return; }
    const found = users?.find((u) => u.email === newAdminEmail.trim());
    if (!found) { setMsg("Nutzer mit dieser E-Mail nicht gefunden."); setAdding(false); return; }
    await supabase.from("profiles").update({ role: "super_admin" }).eq("id", found.id);
    setMsg("Admin hinzugefügt.");
    setNewAdminEmail("");
    loadAdmins();
    setAdding(false);
  };

  return (
    <div>
      <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Einstellungen</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Mein Profil</div>
          <div style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>{currentUser?.email}</div>
          <div style={{ marginTop: 8 }}><Badge label="Super Admin" color={c.accent} /></div>
        </Card>
        <Card>
          <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Super-Admins ({admins.length})</div>
          {admins.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${c.border}22` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, fontSize: 12, fontWeight: 700 }}>
                {(a.vorname?.[0] || "A").toUpperCase()}
              </div>
              <span style={{ color: c.text, fontSize: 13 }}>{a.vorname} {a.nachname}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, borderTop: `1px solid ${c.border}`, paddingTop: 14 }}>
            <div style={{ color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Neuen Admin hinzufügen</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="E-Mail des Nutzers" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
              <button onClick={addAdmin} disabled={adding} style={{ ...baseBtn, background: c.accent, color: "#000" }}>Hinzufügen</button>
            </div>
            {msg && <div style={{ color: msg.includes("nicht") ? c.danger : c.accent, fontSize: 12, marginTop: 8 }}>{msg}</div>}
          </div>
        </Card>
      </div>

      {/* Google Places API Key */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Google Places API Key (Global)</div>
        <p style={{ color: c.textDim, fontSize: 12, marginBottom: 10 }}>Dieser Key wird für alle Teams verwendet — Ortsuche bei Spielen, Trainings und Platzanlage.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} type="password" placeholder="AIzaSy..." value={googleKey} onChange={(e) => setGoogleKey(e.target.value)} />
          <button onClick={async () => {
            if (!googleKey.trim()) return;
            await supabase.from("app_settings").upsert({ key: "google_places_api_key", value: googleKey.trim(), updated_at: new Date().toISOString() });
            setGoogleKeySaved(true);
            setTimeout(() => setGoogleKeySaved(false), 3000);
          }} style={{ ...baseBtn, background: c.accent, color: "#000" }}>Speichern</button>
        </div>
        {googleKeySaved && <div style={{ color: c.accent, fontSize: 12, marginTop: 8 }}>✓ Gespeichert — gilt für alle Teams</div>}
      </Card>

      {/* GitHub Token für Backup API */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>GitHub Token (Backup API)</div>
        <p style={{ color: c.textDim, fontSize: 12, marginBottom: 10 }}>Wird für Backup-Status + manuelles Auslösen benötigt. Token von <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" style={{ color: c.info }}>github.com/settings/tokens</a> mit "repo" Scope.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} type="password" placeholder="ghp_... oder gho_..." id="github-token-input" />
          <button onClick={async () => {
            const val = document.getElementById("github-token-input").value.trim();
            if (!val) return;
            await supabase.from("app_settings").upsert({ key: "github_token", value: val, updated_at: new Date().toISOString() });
            document.getElementById("github-token-input").value = "";
            alert("GitHub Token gespeichert.");
          }} style={{ ...baseBtn, background: c.accent, color: "#000" }}>Speichern</button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// Backup Status
// ============================================
function BackupStatus() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [backupStats, setBackupStats] = useState(null);

  useEffect(() => { loadRuns(); loadStats(); }, []);

  const loadStats = async () => {
    try {
      const { data } = await supabase.from("app_settings").select("value").eq("key", "last_backup_stats").single();
      if (data?.value) setBackupStats(typeof data.value === "string" ? JSON.parse(data.value) : data.value);
    } catch (e) { /* silent */ }
  };

  const callBackupApi = async (action) => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s?.access_token) throw new Error("Keine aktive Session — bitte neu einloggen");
    const fnUrl = `https://uwcvibsysnmcikvylrgp.supabase.co/functions/v1/admin-backup-status`;
    const res = await fetch(fnUrl, {
      method: "POST",
      headers: { "Authorization": `Bearer ${s.access_token}`, "Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y3ZpYnN5c25tY2lrdnlscmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDQ4NTAsImV4cCI6MjA4ODk4MDg1MH0.rUUH4_G8oV5CtyIKvihok9rTQcdcGBMpswy8TBugqZY" },
      body: JSON.stringify({ action }),
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error(`Antwort nicht JSON: ${text.substring(0, 200)}`); }
    if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}: ${text.substring(0, 200)}`);
    return data;
  };

  const [loadError, setLoadError] = useState(null);
  const loadRuns = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await callBackupApi("status");
      setRuns(data.runs || []);
    } catch (e) { console.error(e); setLoadError(e.message); }
    setLoading(false);
  };

  const triggerBackup = async () => {
    setTriggering(true);
    try {
      await callBackupApi("trigger");
      alert("Backup gestartet! Status wird in 1-2 Minuten aktualisiert.");
      setTimeout(loadRuns, 10000);
    } catch (e) { alert("Backup Fehler: " + (e.message || JSON.stringify(e))); }
    setTriggering(false);
  };

  const statusIcon = (conclusion, status) => {
    if (status === "in_progress" || status === "queued") return "🔄";
    if (conclusion === "success") return "✅";
    if (conclusion === "failure") return "❌";
    if (conclusion === "cancelled") return "⏹";
    return "❓";
  };
  const statusColor = (conclusion, status) => {
    if (status === "in_progress" || status === "queued") return c.info;
    if (conclusion === "success") return c.accent;
    if (conclusion === "failure") return c.danger;
    return c.textDim;
  };
  const statusLabel = (conclusion, status) => {
    if (status === "in_progress") return "Läuft...";
    if (status === "queued") return "In Warteschlange";
    if (conclusion === "success") return "Erfolgreich";
    if (conclusion === "failure") return "Fehlgeschlagen";
    if (conclusion === "cancelled") return "Abgebrochen";
    return status;
  };
  const fmtDuration = (start, end) => {
    if (!start || !end) return "—";
    const ms = new Date(end) - new Date(start);
    const s = Math.floor(ms / 1000);
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
  };
  const fmtDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const lastSuccess = runs.find((r) => r.conclusion === "success");
  const lastFailure = runs.find((r) => r.conclusion === "failure");
  const successCount = runs.filter((r) => r.conclusion === "success").length;
  const failCount = runs.filter((r) => r.conclusion === "failure").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700 }}>Backup Status</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadRuns} style={{ ...baseBtn, background: c.surface, color: c.textDim, border: `1px solid ${c.border}` }}>Aktualisieren</button>
          <button onClick={triggerBackup} disabled={triggering}
            style={{ ...baseBtn, background: triggering ? c.textDim : c.accent, color: "#000", opacity: triggering ? 0.6 : 1 }}>
            {triggering ? "Wird gestartet..." : "Backup jetzt starten"}
          </button>
        </div>
      </div>

      {loading ? <div style={{ color: c.textDim, textAlign: "center", padding: 40 }}>Laden...</div> : loadError ? (
        <Card><div style={{ color: c.danger, fontSize: 13 }}>Fehler: {loadError}</div></Card>
      ) : (
        <>
          {/* Übersicht Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
            <StatCard label="Letztes Backup" value={lastSuccess ? fmtDateTime(lastSuccess.created_at) : "—"} sub={lastSuccess ? `Dauer: ${fmtDuration(lastSuccess.run_started_at, lastSuccess.updated_at)}` : "Noch kein Backup"} color={c.accent} />
            <StatCard label="Erfolgsrate" value={runs.length ? `${Math.round(successCount / runs.length * 100)}%` : "—"} sub={`${successCount} / ${runs.length} Runs`} color={failCount === 0 ? c.accent : c.warn} />
            <StatCard label="Fehlgeschlagen" value={failCount} sub={lastFailure ? `Letzter: ${fmtDateTime(lastFailure.created_at)}` : "Keine Fehler"} color={failCount > 0 ? c.danger : c.accent} />
            <StatCard label="Zeitplan" value="02:00 UTC" sub="Täglich automatisch" color={c.info} />
          </div>

          {/* Dateigrößen */}
          {backupStats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              <StatCard label="Datenbank" value={backupStats.db_size || "—"} sub={`${backupStats.db_lines || 0} SQL-Zeilen`} color={c.accent} />
              <StatCard label="Storage Files" value={backupStats.storage_size || "—"} sub={`${backupStats.storage_files || 0} Dateien`} color={c.info} />
              <StatCard label="Environment" value={backupStats.env_size || "—"} sub="GPG-verschlüsselt" color={c.warn} />
              <StatCard label="Typ" value={backupStats.event === "schedule" ? "Automatisch" : "Manuell"} sub={backupStats.date ? fmtDateTime(backupStats.date) : "—"} color={backupStats.event === "schedule" ? c.info : c.accent} />
            </div>
          )}

          {/* Backup-Inhalte */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Was wird gesichert</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: c.bg, borderRadius: 8, padding: 12, border: `1px solid ${c.border}` }}>
                <div style={{ color: c.accent, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>PostgreSQL Datenbank</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>Kompletter pg_dump, komprimiert (.sql.gz)</div>
                <div style={{ color: c.textMuted, fontSize: 10, marginTop: 4 }}>Daily: 7 Tage · Weekly: 4 Wochen · Monthly: 12 Monate</div>
              </div>
              <div style={{ background: c.bg, borderRadius: 8, padding: 12, border: `1px solid ${c.border}` }}>
                <div style={{ color: c.info, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Storage Files</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>Spielerfotos, Wappen via rclone S3 Sync</div>
                <div style={{ color: c.textMuted, fontSize: 10, marginTop: 4 }}>Letzte 7 Tage aufbewahrt</div>
              </div>
              <div style={{ background: c.bg, borderRadius: 8, padding: 12, border: `1px solid ${c.border}` }}>
                <div style={{ color: c.warn, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Environment</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>Alle Secrets als GPG-verschlüsselte Datei</div>
                <div style={{ color: c.textMuted, fontSize: 10, marginTop: 4 }}>Letzte 30 Tage aufbewahrt</div>
              </div>
            </div>
          </Card>

          {/* Run-Historie */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}` }}>
              <span style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Letzte 20 Runs</span>
            </div>
            {runs.length === 0 && <div style={{ padding: 24, color: c.textDim, textAlign: "center" }}>Noch keine Backup-Runs.</div>}
            {runs.map((r) => (
              <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer"
                style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px 80px", gap: 0, alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${c.border}22`, textDecoration: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 16 }}>{statusIcon(r.conclusion, r.status)}</span>
                <div>
                  <div style={{ color: c.text, fontSize: 12, fontWeight: 500 }}>{r.display_title || "Kicklog Backup"}</div>
                  <div style={{ color: c.textDim, fontSize: 10 }}>{r.event === "schedule" ? "Automatisch (Zeitplan)" : r.event === "workflow_dispatch" ? "Manuell gestartet" : r.event}</div>
                </div>
                <span style={{ color: statusColor(r.conclusion, r.status), fontSize: 11, fontWeight: 600 }}>{statusLabel(r.conclusion, r.status)}</span>
                <span style={{ color: c.textDim, fontSize: 11 }}>{fmtDateTime(r.created_at)}</span>
                <span style={{ color: c.textDim, fontSize: 10, textAlign: "right" }}>{fmtDuration(r.run_started_at, r.updated_at)}</span>
              </a>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}

// ============================================
// System Settings (Maintenance Mode)
// ============================================
function SystemSettings({ currentUser }) {
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [updatedByEmail, setUpdatedByEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("system_settings").select("*").eq("key", "maintenance_mode").single();
      if (data) {
        setMaintenanceActive(data.value === "true");
        setMaintenanceMessage(data.message || "");
        setUpdatedAt(data.updated_at);
        if (data.updated_by) {
          try {
            const { data: { session: s } } = await supabase.auth.getSession();
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_creators`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${s?.access_token || ANON_KEY}` },
              body: JSON.stringify({ creator_ids: [data.updated_by] }),
            });
            if (res.ok) {
              const [user] = await res.json();
              if (user) setUpdatedByEmail(user.email || `${user.vorname} ${user.nachname}`);
            }
          } catch { /* silent */ }
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleMaintenance = async () => {
    setSaving(true);
    const newVal = !maintenanceActive;
    await supabase.from("system_settings").update({
      value: newVal ? "true" : "false",
      message: maintenanceMessage.trim() || null,
      updated_at: new Date().toISOString(),
      updated_by: currentUser?.id,
    }).eq("key", "maintenance_mode");
    setMaintenanceActive(newVal);
    setUpdatedAt(new Date().toISOString());
    setUpdatedByEmail(currentUser?.email);
    setSaving(false);
  };

  const saveMessage = async () => {
    setSaving(true);
    await supabase.from("system_settings").update({
      message: maintenanceMessage.trim() || null,
      updated_at: new Date().toISOString(),
      updated_by: currentUser?.id,
    }).eq("key", "maintenance_mode");
    setUpdatedAt(new Date().toISOString());
    setSaving(false);
  };

  const fmtDT = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  if (loading) return <div style={{ color: c.textDim, textAlign: "center", padding: 40 }}>Laden...</div>;

  return (
    <div>
      <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>System-Einstellungen</h2>

      {/* Maintenance Mode */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ color: c.text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Maintenance-Modus</div>
            <div style={{ color: c.textDim, fontSize: 12 }}>Wenn aktiv: App zeigt Wartungsseite, kein Login möglich. Super-Admins haben weiterhin Zugriff.</div>
          </div>
          <button onClick={toggleMaintenance} disabled={saving}
            style={{
              ...baseBtn, padding: "10px 24px", fontSize: 14, fontWeight: 700,
              background: maintenanceActive ? c.danger : c.accent,
              color: maintenanceActive ? "#fff" : "#000",
              opacity: saving ? 0.6 : 1,
            }}>
            {saving ? "..." : maintenanceActive ? "Deaktivieren" : "Aktivieren"}
          </button>
        </div>

        {/* Status Banner */}
        <div style={{
          padding: "12px 16px", borderRadius: 8, marginBottom: 16,
          background: maintenanceActive ? c.danger + "15" : c.accent + "15",
          border: `1px solid ${maintenanceActive ? c.danger : c.accent}33`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: maintenanceActive ? c.danger : c.accent }} />
          <span style={{ color: maintenanceActive ? c.danger : c.accent, fontSize: 13, fontWeight: 600 }}>
            {maintenanceActive ? "Maintenance-Modus ist AKTIV — App ist für User gesperrt" : "App ist online — normaler Betrieb"}
          </span>
        </div>

        {/* Message */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: c.textDim, fontSize: 11, display: "block", marginBottom: 4 }}>Wartungsnachricht (optional)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="z.B. Update auf Version 2.0 — ca. 30 Minuten"
              value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} />
            <button onClick={saveMessage} disabled={saving}
              style={{ ...baseBtn, background: c.surface, color: c.textDim, border: `1px solid ${c.border}` }}>Speichern</button>
          </div>
        </div>

        {/* Last changed */}
        {updatedAt && (
          <div style={{ color: c.textMuted, fontSize: 11 }}>
            Zuletzt geändert: {fmtDT(updatedAt)}{updatedByEmail ? ` von ${updatedByEmail}` : ""}
          </div>
        )}
      </Card>

      {/* Preview */}
      {maintenanceActive && (
        <Card>
          <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Vorschau der Wartungsseite</div>
          <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 32, textAlign: "center", border: `1px solid ${c.border}` }}>
            <div style={{ color: "#22c55e", fontSize: 24, marginBottom: 12 }}>⚽</div>
            <div style={{ color: "#e5e5e5", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Kurze Pause</div>
            <div style={{ color: "#888", fontSize: 13 }}>{maintenanceMessage || "Wir arbeiten gerade an Kicklog und sind gleich wieder da."}</div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================
// Club Onboarding Wizard
// ============================================
const LIGA_OPTIONS = ["Kreisliga A", "Kreisliga B", "Kreisliga C", "Bezirksliga", "Landesliga", "Verbandsliga", "Oberliga", "Regionalliga", "Sonstige"];

function ClubOnboardingWizard({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [clubData, setClubData] = useState({ name: "", contact_name: "", contact_email: "", contact_phone: "", num_teams: 1, internal_note: "" });
  const [teamsData, setTeamsData] = useState([{ name: "", liga: "Kreisliga A", trainer_name: "", trainer_email: "" }]);
  const [creating, setCreating] = useState(false);
  const [log, setLog] = useState([]);
  const [result, setResult] = useState(null);
  const [step1Err, setStep1Err] = useState("");

  const handleClubField = (field, value) => {
    setClubData((prev) => ({ ...prev, [field]: value }));
    if (field === "num_teams") {
      const n = parseInt(value) || 1;
      setTeamsData((prev) => {
        if (prev.length === n) return prev;
        if (prev.length < n) return [...prev, ...Array(n - prev.length).fill(null).map(() => ({ name: "", liga: "Kreisliga A", trainer_name: "", trainer_email: "" }))];
        return prev.slice(0, n);
      });
    }
  };

  const handleTeamField = (i, field, value) => setTeamsData((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));

  const handleCreate = async () => {
    setCreating(true);
    setLog(["Verein wird angelegt..."]);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    setTimeout(() => setLog((p) => [...p, "Teams werden erstellt..."]), 600);
    setTimeout(() => setLog((p) => [...p, "Einladungen werden versendet..."]), 1400);
    const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-create-club`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ clubData, teamsData }),
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      setLog((p) => [...p, "❌ Fehler: " + json.error]);
      setCreating(false);
      return;
    }
    setResult(json);
    setCreating(false);
    setStep(4);
  };

  const accounts = [
    { email: clubData.contact_email, role: "club_admin", label: "Vereinsadmin" },
    ...teamsData.filter((t) => t.trainer_email).map((t) => ({ email: t.trainer_email, role: "coach", label: `Trainer — ${t.name || "Team"}` })),
  ];

  const progressStyle = { height: 4, background: c.border, borderRadius: 2, overflow: "hidden", marginTop: 14 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, width: "100%", maxWidth: 600, maxHeight: "92vh", overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: c.text, fontWeight: 700, fontSize: 16 }}>
              {step === 4 ? "✅ Fertig!" : `Neuer Vereinskunde — Schritt ${step} von 4`}
            </span>
            {step !== 4 && !creating && <button onClick={onClose} style={{ ...baseBtn, background: "transparent", color: c.textDim, padding: "2px 8px", fontSize: 18 }}>×</button>}
          </div>
          <div style={progressStyle}>
            <div style={{ height: "100%", width: `${(step / 4) * 100}%`, background: c.accent, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Vereinsname *", field: "name", placeholder: "FC Musterstadt e.V." },
                { label: "Ansprechpartner (Vorstand) *", field: "contact_name", placeholder: "Max Mustermann" },
                { label: "E-Mail Ansprechpartner *", field: "contact_email", placeholder: "vorstand@fc-musterstadt.de", type: "email" },
                { label: "Telefon (optional)", field: "contact_phone", placeholder: "+49 ..." },
              ].map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
                  <input style={inputStyle} type={type || "text"} placeholder={placeholder}
                    value={clubData[field]} onChange={(e) => handleClubField(field, e.target.value)} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Anzahl Teams *</label>
                <select style={inputStyle} value={clubData.num_teams} onChange={(e) => handleClubField("num_teams", parseInt(e.target.value))}>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Interne Notiz (optional)</label>
                <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Hat über Instagram angefragt..."
                  value={clubData.internal_note} onChange={(e) => handleClubField("internal_note", e.target.value)} />
              </div>
              {step1Err && <div style={{ color: c.danger, fontSize: 12 }}>{step1Err}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => {
                  if (!clubData.name.trim() || !clubData.contact_email.trim()) { setStep1Err("Vereinsname und E-Mail sind Pflichtfelder."); return; }
                  setStep1Err(""); setStep(2);
                }} style={{ ...baseBtn, background: c.accent, color: "#000", padding: "10px 24px", fontSize: 13 }}>Weiter →</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <p style={{ color: c.textDim, fontSize: 13, marginBottom: 20 }}>Lege die Teams des Vereins an:</p>
              {teamsData.map((team, i) => (
                <div key={i} style={{ background: c.bg, borderRadius: 8, padding: 16, marginBottom: 14, border: `1px solid ${c.border}` }}>
                  <div style={{ color: c.accent, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Team {i + 1}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Name *", field: "name", placeholder: "1. Herren" },
                      { label: "Trainer Name", field: "trainer_name", placeholder: "Thomas Müller" },
                      { label: "Trainer Mail *", field: "trainer_email", placeholder: "trainer@verein.de", type: "email" },
                    ].map(({ label, field, placeholder, type }) => (
                      <div key={field}>
                        <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>{label}</label>
                        <input style={inputStyle} type={type || "text"} placeholder={placeholder}
                          value={team[field]} onChange={(e) => handleTeamField(i, field, e.target.value)} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>Liga</label>
                      <select style={inputStyle} value={team.liga} onChange={(e) => handleTeamField(i, "liga", e.target.value)}>
                        {LIGA_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setTeamsData((p) => [...p, { name: "", liga: "Kreisliga A", trainer_name: "", trainer_email: "" }])}
                style={{ ...baseBtn, background: "transparent", color: c.textDim, border: `1px dashed ${c.border}`, width: "100%", marginBottom: 20 }}>
                + Weiteres Team hinzufügen
              </button>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setStep(1)} style={{ ...baseBtn, background: c.surface, color: c.textDim, border: `1px solid ${c.border}` }}>← Zurück</button>
                <button onClick={() => setStep(3)} style={{ ...baseBtn, background: c.accent, color: "#000", padding: "10px 24px", fontSize: 13 }}>Weiter →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <p style={{ color: c.textDim, fontSize: 13, marginBottom: 20 }}>Wir legen jetzt folgende Accounts an:</p>
              {accounts.map((a, i) => (
                <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>👤</span>
                    <span style={{ color: c.text, fontWeight: 600, fontSize: 13 }}>{a.label}</span>
                    <Badge label={a.role === "club_admin" ? "Vereinsadmin" : "Trainer"} color={a.role === "club_admin" ? c.info : c.accent} />
                  </div>
                  <div style={{ color: c.textDim, fontSize: 12, marginLeft: 28 }}>{a.email || <span style={{ color: c.danger }}>Keine E-Mail angegeben</span>}</div>
                </div>
              ))}
              {creating && (
                <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  {log.map((l, i) => <div key={i} style={{ color: i === log.length - 1 ? c.accent : c.textMuted, fontSize: 12, padding: "3px 0" }}>{l}</div>)}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                <button onClick={() => setStep(2)} disabled={creating} style={{ ...baseBtn, background: c.surface, color: c.textDim, border: `1px solid ${c.border}` }}>← Zurück</button>
                <button onClick={handleCreate} disabled={creating} style={{ ...baseBtn, background: c.accent, color: "#000", padding: "10px 24px", fontSize: 13 }}>
                  {creating ? "Wird angelegt..." : "Jetzt anlegen & Einladungen senden →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && result && (
            <div>
              <div style={{ background: c.accentDim, border: `1px solid ${c.accent}33`, borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <div style={{ color: c.accent, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>✅ {clubData.name} wurde erfolgreich angelegt</div>
                <div style={{ color: c.textDim, fontSize: 12, marginTop: 6 }}>✓ Verein angelegt (Club-Plan, aktiv)</div>
                <div style={{ color: c.textDim, fontSize: 12 }}>✓ {teamsData.length} Team{teamsData.length !== 1 ? "s" : ""} erstellt</div>
                <div style={{ color: c.textDim, fontSize: 12 }}>✓ {result.results?.filter((r) => r.status === "invited").length || 0} Einladungs-Mails versendet</div>
              </div>
              <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Versendete Einladungen:</div>
              {result.results?.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: `1px solid ${c.border}22` }}>
                  <span style={{ fontSize: 14 }}>{r.status === "invited" ? "📧" : "❌"}</span>
                  <span style={{ color: c.text, fontSize: 13, flex: 1 }}>{r.email}</span>
                  <Badge label={r.role === "club_admin" ? "Vereinsadmin" : "Trainer"} color={r.role === "club_admin" ? c.info : c.accent} />
                  {r.status === "error" && <span style={{ color: c.danger, fontSize: 11 }}>{r.error}</span>}
                </div>
              ))}
              <div style={{ color: c.textDim, fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
                Die Empfänger bekommen einen Magic Link per E-Mail. Nach dem ersten Login können sie sofort loslegen.
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => { onSuccess(result.club); onClose(); }}
                  style={{ ...baseBtn, background: c.accentDim, color: c.accent, border: `1px solid ${c.accent}33`, flex: 1, padding: "10px" }}>
                  Zur Vereinsübersicht
                </button>
                <button onClick={() => {
                  setStep(1); setResult(null); setLog([]);
                  setClubData({ name: "", contact_name: "", contact_email: "", contact_phone: "", num_teams: 1, internal_note: "" });
                  setTeamsData([{ name: "", liga: "Kreisliga A", trainer_name: "", trainer_email: "" }]);
                }} style={{ ...baseBtn, background: c.surface, color: c.textDim, border: `1px solid ${c.border}`, flex: 1, padding: "10px" }}>
                  Weiteren Verein anlegen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Club Detail Modal
// ============================================
function ClubDetailModal({ club, onClose, onUpdate }) {
  const [tab, setTab] = useState("overview");
  const [status, setStatus] = useState(club.plan_status || "active");
  const [trialEnds, setTrialEnds] = useState(club.trial_ends_at ? club.trial_ends_at.substring(0, 10) : "");
  const [saving, setSaving] = useState(false);
  const [teams, setTeams] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [tr, nr, pr] = await Promise.all([
        supabase.from("teams").select("*").eq("club_id", club.id).order("name"),
        supabase.from("admin_notes").select("*").eq("club_id", club.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("club_id", club.id),
      ]);
      setTeams(tr.data || []);
      setNotes(nr.data || []);
      setProfiles(pr.data || []);
    };
    load();
  }, [club.id]);

  const save = async () => {
    setSaving(true);
    await supabase.from("clubs").update({ plan_status: status, trial_ends_at: trialEnds || null }).eq("id", club.id);
    onUpdate({ ...club, plan_status: status, trial_ends_at: trialEnds || null });
    setSaving(false);
  };

  const extendTrial = async (days) => {
    const base = trialEnds ? new Date(trialEnds) : new Date();
    base.setDate(base.getDate() + days);
    const d = base.toISOString().substring(0, 10);
    setTrialEnds(d);
    await supabase.from("clubs").update({ trial_ends_at: d }).eq("id", club.id);
    onUpdate({ ...club, trial_ends_at: d });
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { data } = await supabase.from("admin_notes").insert({ club_id: club.id, note: newNote.trim() }).select().single();
    if (data) setNotes([data, ...notes]);
    setNewNote("");
  };

  return (
    <Modal title={club.name} onClose={onClose} width={760}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Badge label="Club" color={c.info} />
        <Badge label={statusLabel(club.plan_status)} color={statusColor(club.plan_status)} />
        <span style={{ color: c.textDim, fontSize: 12, marginLeft: "auto" }}>Seit {fmtDate(club.created_at)}</span>
      </div>
      <Tabs tabs={[
        { key: "overview", label: "Übersicht" },
        { key: "notes", label: `Notizen (${notes.length})` },
        { key: "accounts", label: `Zugänge (${profiles.length})` },
      ]} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ l: "Ansprechpartner", v: club.contact_name }, { l: "E-Mail", v: club.contact_email }, { l: "Telefon", v: club.contact_phone }, { l: "Anzahl Teams", v: club.num_teams }].map(({ l, v }) => (
              <div key={l} style={{ background: c.bg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${c.border}` }}>
                <div style={{ color: c.textDim, fontSize: 10, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                <div style={{ color: c.text, fontSize: 13 }}>{v || "—"}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Status</label>
              <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="trial">Trial</option><option value="active">Aktiv</option><option value="suspended">Gesperrt</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", color: c.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Trial Ende</label>
              <input style={inputStyle} type="date" value={trialEnds} onChange={(e) => setTrialEnds(e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[30, 60, 90].map((d) => <button key={d} onClick={() => extendTrial(d)} style={{ ...baseBtn, background: c.warnDim, color: c.warn }}>+{d}d</button>)}
          </div>
          <button onClick={save} disabled={saving} style={{ ...baseBtn, background: c.accent, color: "#000", fontWeight: 700, padding: "9px 20px", marginBottom: 24 }}>
            {saving ? "Speichern..." : "Änderungen speichern"}
          </button>
          <div style={{ color: c.textDim, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Teams ({teams.length})</div>
          {teams.length === 0 && <div style={{ color: c.textDim, fontSize: 13 }}>Noch keine Teams.</div>}
          {teams.map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${c.border}22` }}>
              <div>
                <div style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>{t.liga || "—"} · {t.saison || "—"}</div>
              </div>
              <span onClick={() => navigator.clipboard.writeText(t.id)} title="ID kopieren"
                style={{ color: c.textMuted, fontSize: 10, fontFamily: "monospace", cursor: "pointer", alignSelf: "center" }}>{t.id.substring(0, 8)}…</span>
            </div>
          ))}
        </div>
      )}

      {tab === "notes" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Neue Admin-Notiz..."
              style={{ ...inputStyle, minHeight: 72, resize: "vertical", flex: 1 }} />
            <button onClick={addNote} style={{ ...baseBtn, background: c.accent, color: "#000", alignSelf: "flex-start", whiteSpace: "nowrap" }}>Hinzufügen</button>
          </div>
          {notes.length === 0 && <div style={{ color: c.textDim, fontSize: 13, textAlign: "center", padding: 24 }}>Noch keine Notizen.</div>}
          {notes.map((n) => (
            <div key={n.id} style={{ borderBottom: `1px solid ${c.border}`, padding: "10px 0" }}>
              <div style={{ color: c.textDim, fontSize: 11, marginBottom: 4 }}>{fmtDateTime(n.created_at)}</div>
              <div style={{ color: c.text, fontSize: 13, lineHeight: 1.5 }}>{n.note}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "accounts" && (
        <div>
          {profiles.length === 0 && <div style={{ color: c.textDim, fontSize: 13, textAlign: "center", padding: 24 }}>Keine Zugänge gefunden.</div>}
          {profiles.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${c.border}22` }}>
              <div>
                <div style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{[p.vorname, p.nachname].filter(Boolean).join(" ") || "—"}</div>
                <div style={{ color: c.textDim, fontSize: 11 }}>{p.role || "user"}</div>
              </div>
              <Badge label={p.role === "club_admin" ? "Vereinsadmin" : p.role === "coach" ? "Trainer" : p.role || "User"}
                color={p.role === "club_admin" ? c.info : c.accent} />
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ============================================
// Clubs List
// ============================================
function Clubs({ clubs, onUpdate, onNewClub }) {
  const [selectedClub, setSelectedClub] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = clubs.filter((cl) => {
    if (statusFilter !== "all" && cl.plan_status !== statusFilter) return false;
    if (search && !cl.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStatus = async (club) => {
    const newStatus = club.plan_status === "suspended" ? "active" : "suspended";
    await supabase.from("clubs").update({ plan_status: newStatus }).eq("id", club.id);
    onUpdate({ ...club, plan_status: newStatus });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700 }}>Vereine / Clubs ({filtered.length})</h2>
        <button onClick={onNewClub} style={{ ...baseBtn, background: c.accent, color: "#000", padding: "9px 18px" }}>+ Neuer Vereinskunde</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, width: 220 }} placeholder="Vereinsname suchen..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "trial", "suspended"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ ...baseBtn, background: statusFilter === s ? statusColor(s) + "22" : c.surface, color: statusFilter === s ? statusColor(s) : c.textDim, border: `1px solid ${statusFilter === s ? statusColor(s) + "44" : c.border}` }}>
              {s === "all" ? "Alle" : statusLabel(s)}
            </button>
          ))}
        </div>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 70px 100px 120px 160px", gap: 0 }}>
          {["Vereinsname", "Ansprechpartner", "Teams", "Status", "Trial Ende", "Aktionen"].map((h) => (
            <div key={h} style={{ color: c.textDim, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, padding: "10px 16px", borderBottom: `1px solid ${c.border}` }}>{h}</div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: 40, color: c.textDim, textAlign: "center", fontSize: 13 }}>
              Noch keine Vereine.{" "}
              <span style={{ color: c.accent, cursor: "pointer" }} onClick={onNewClub}>Ersten Verein anlegen →</span>
            </div>
          )}
          {filtered.map((cl) => {
            const days = daysUntil(cl.trial_ends_at);
            return [
              <div key={`${cl.id}-n`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ color: c.text, fontWeight: 600, fontSize: 13 }}>{cl.name}</span>
                <span onClick={() => navigator.clipboard.writeText(cl.id)} title="ID kopieren"
                  style={{ color: c.textMuted, fontSize: 10, fontFamily: "monospace", cursor: "pointer", marginTop: 2 }}>{cl.id}</span>
              </div>,
              <div key={`${cl.id}-c`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ color: c.text, fontSize: 12 }}>{cl.contact_name || "—"}</span>
                <span style={{ color: c.textDim, fontSize: 11 }}>{cl.contact_email}</span>
              </div>,
              <div key={`${cl.id}-t`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center", color: c.text, fontWeight: 700, fontSize: 16 }}>
                {cl.num_teams || "—"}
              </div>,
              <div key={`${cl.id}-s`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center" }}>
                <Badge label={statusLabel(cl.plan_status)} color={statusColor(cl.plan_status)} />
              </div>,
              <div key={`${cl.id}-d`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center" }}>
                {cl.trial_ends_at
                  ? <span style={{ color: days !== null && days <= 30 ? (days <= 7 ? c.danger : c.warn) : c.textDim, fontSize: 12 }}>
                    {fmtDate(cl.trial_ends_at)}{days !== null && days <= 30 ? ` (${days}d)` : ""}
                  </span>
                  : <span style={{ color: c.textMuted, fontSize: 12 }}>—</span>}
              </div>,
              <div key={`${cl.id}-a`} style={{ padding: "12px 16px", borderBottom: `1px solid ${c.border}22`, display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setSelectedClub(cl)} style={{ ...baseBtn, background: c.accentDim, color: c.accent, border: `1px solid ${c.accent}33` }}>Details</button>
                <button onClick={() => toggleStatus(cl)}
                  style={{ ...baseBtn, background: cl.plan_status === "suspended" ? c.accentDim : c.dangerDim, color: cl.plan_status === "suspended" ? c.accent : c.danger, border: `1px solid ${cl.plan_status === "suspended" ? c.accent : c.danger}33` }}>
                  {cl.plan_status === "suspended" ? "Aktivieren" : "Sperren"}
                </button>
              </div>,
            ];
          })}
        </div>
      </Card>
      {selectedClub && (
        <ClubDetailModal club={selectedClub} onClose={() => setSelectedClub(null)}
          onUpdate={(updated) => { onUpdate(updated); setSelectedClub(updated); }} />
      )}
    </div>
  );
}

// ============================================
// Main App
// ============================================
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [teams, setTeams] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showClubWizard, setShowClubWizard] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const role = session.user?.app_metadata?.role;
        if (role === "super_admin") {
          setSession(session);
          setProfile({ role, vorname: session.user.user_metadata?.vorname || "", nachname: session.user.user_metadata?.nachname || "" });
        } else await supabase.auth.signOut();
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) { setSession(null); setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) { loadTeams(); loadClubs(); }
  }, [session]);

  const loadTeams = async () => {
    setDataLoading(true);
    const { data } = await supabase.from("teams").select("*").order("created_at", { ascending: false });
    // Load all profiles (visible via "Users can view all profiles" RLS)
    const { data: allProfiles } = await supabase.from("profiles").select("id, team_id, vorname, nachname, funktion");
    // Get emails via DB function (bypasses browser auth API restriction)
    const profileIds = (allProfiles || []).map((p) => p.id);
    let profileList = allProfiles || [];
    if (profileIds.length) {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_creators`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${s?.access_token || ANON_KEY}` },
          body: JSON.stringify({ creator_ids: profileIds }),
        });
        if (res.ok) {
          const creators = await res.json();
          const emailMap = {};
          creators.forEach((cr) => { emailMap[cr.id] = cr.email; });
          profileList = (allProfiles || []).map((p) => ({ ...p, email: emailMap[p.id] || "—" }));
        }
      } catch (e) { profileList = (allProfiles || []).map((p) => ({ ...p, email: "—" })); }
    }
    const teamsWithProfiles = (data || []).map((t) => ({
      ...t,
      members: profileList.filter((p) => p.team_id === t.id),
    }));
    setTeams(teamsWithProfiles);
    setDataLoading(false);
  };

  const loadClubs = async () => {
    const { data } = await supabase.from("clubs").select("*").order("created_at", { ascending: false });
    setClubs(data || []);
  };

  const handleLogin = (user, prof) => { setSession({ user }); setProfile(prof); };
  const handleLogout = async () => { await supabase.auth.signOut(); setSession(null); setProfile(null); };
  const updateTeam = (updated) => setTeams(teams.map((t) => t.id === updated.id ? updated : t));
  const updateClub = (updated) => setClubs(clubs.map((cl) => cl.id === updated.id ? updated : cl));

  if (loading) return <div style={{ minHeight: "100vh", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.textDim }}>Laden...</div>;
  if (!session) return <LoginScreen onLogin={handleLogin} />;

  const navIcon = (name, color) => {
    const s = { width: 18, height: 18, fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
    const icons = {
      dashboard: <svg {...s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      customers: <svg {...s} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      clubs: <svg {...s} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      requests: <svg {...s} viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
      settings: <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
      backup: <svg {...s} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
      system: <svg {...s} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    };
    return icons[name] || null;
  };
  const NAV = [
    { key: "dashboard", label: "Dashboard" },
    { key: "customers", label: "Kunden (Teams)" },
    { key: "clubs", label: "Vereine (Clubs)" },
    { key: "requests", label: "Feature Requests" },
    { key: "settings", label: "Einstellungen" },
    { key: "backup", label: "Backup" },
    { key: "system", label: "System" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: c.sidebar, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${c.border}` }}>
          <Logo size={22} />
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
          {/* CTA: Neuer Vereinskunde */}
          <button onClick={() => setShowClubWizard(true)}
            style={{ ...baseBtn, width: "100%", textAlign: "left", background: c.accent, color: "#000", padding: "9px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 12, borderRadius: 8 }}>
            <span style={{ fontSize: 15 }}>＋</span> Neuer Vereinskunde
          </button>
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setPage(n.key)}
              style={{ ...baseBtn, width: "100%", textAlign: "left", background: page === n.key ? c.accentDim : "transparent", color: page === n.key ? c.accent : c.textDim, padding: "9px 12px", marginBottom: 2, display: "flex", alignItems: "center", gap: 10, fontWeight: page === n.key ? 700 : 500, fontSize: 13, borderRadius: 8 }}>
              {navIcon(n.key, page === n.key ? c.accent : c.textDim)}
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${c.border}` }}>
          <div style={{ color: c.textDim, fontSize: 11, padding: "4px 12px", marginBottom: 6 }}>
            {profile?.vorname} {profile?.nachname}
          </div>
          <button onClick={handleLogout} style={{ ...baseBtn, width: "100%", textAlign: "left", background: "transparent", color: c.textDim, padding: "8px 12px", fontSize: 12 }}>
            Ausloggen
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        {dataLoading && page !== "requests" && page !== "settings" && page !== "clubs" && page !== "backup" && page !== "system" ? (
          <div style={{ color: c.textDim, textAlign: "center", paddingTop: 60 }}>Daten werden geladen...</div>
        ) : (
          <>
            {page === "dashboard" && <Dashboard teams={teams} onNavigate={setPage} />}
            {page === "customers" && <Customers teams={teams} onUpdate={updateTeam} onCreateTeam={(t) => setTeams((prev) => [t, ...prev])} onDeleteTeam={(id) => setTeams((prev) => prev.filter((t) => t.id !== id))} />}
            {page === "clubs" && <Clubs clubs={clubs} onUpdate={updateClub} onNewClub={() => setShowClubWizard(true)} />}
            {page === "requests" && <FeatureRequests />}
            {page === "settings" && <Settings currentUser={session?.user} />}
            {page === "backup" && <BackupStatus />}
            {page === "system" && <SystemSettings currentUser={session?.user} />}
          </>
        )}
      </div>

      {/* Club Onboarding Wizard */}
      {showClubWizard && (
        <ClubOnboardingWizard
          onClose={() => setShowClubWizard(false)}
          onSuccess={(club) => { setClubs([club, ...clubs]); setPage("clubs"); setShowClubWizard(false); }}
        />
      )}
    </div>
  );
}
