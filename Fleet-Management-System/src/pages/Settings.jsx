import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";


const C = "#4f46e5";

const TabIcon = ({ active, children }) => (
    <span style={{ color: active ? "#fff" : "#555", display: "flex" }}>{children}</span>
);

export default function Settings() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [tab, setTab] = useState("profile");


    const [profile, setProfile] = useState({
        name: user?.name || "Fleet Manager",
        email: user?.email || "manager12@gmail.com",
        phone: "+91 98765 43210",
        role: user?.role || "manager",
        department: "Fleet Operations",
        location: "Ahmedabad, Gujarat",
    });

    const [prefs, setPrefs] = useState({
        theme: theme,

        language: "en",
        timezone: "Asia/Kolkata",
        currency: "INR",
        distanceUnit: "km",
        emailAlerts: true,
        maintenanceAlerts: true,
        tripAlerts: true,
        licenseAlerts: true,
        weeklyReport: false,
        compactMode: false,
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const inputStyle = {
        width: "100%", padding: "10px 14px",
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        borderRadius: 9, color: "var(--text-primary)", fontSize: "0.85rem",
        fontFamily: "inherit", outline: "none", boxSizing: "border-box",
        transition: "border-color .15s",
    };

    const labelStyle = {
        display: "block", fontSize: "0.75rem", color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6,
    };

    const Toggle = ({ value, onChange, label }) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>{label}</span>

            <button
                onClick={() => onChange(!value)}
                style={{
                    width: 44, height: 24, borderRadius: 12, border: "none",
                    background: value ? C : "var(--border)", cursor: "pointer",
                    position: "relative", transition: "background .2s", flexShrink: 0,
                }}
            >
                <span style={{
                    position: "absolute", top: 3, left: value ? 23 : 3,
                    width: 18, height: 18, borderRadius: "50%", background: "#fff",
                    transition: "left .2s", boxShadow: "var(--shadow-sm)",
                }} />

            </button>
        </div>
    );

    const tabs = [
        {
            key: "profile", label: "Profile",
            icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        },
        {
            key: "preferences", label: "Preferences",
            icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-2M5 12H3M12 21v-2M12 5V3" /></svg>
        },
        {
            key: "security", label: "Security",
            icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        },
    ];

    const roleBadgeColor = { manager: "#4f46e5", dispatcher: "#10b981", safety_officer: "#f59e0b", analyst: "#3b82f6" };
    const roleColor = roleBadgeColor[profile.role] || C;

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h2 className="page-title">Settings</h2>
                    <p className="page-subtitle">Manage your profile, preferences and account security</p>
                </div>
                <button
                    onClick={handleSave}
                    style={{
                        padding: "9px 22px", borderRadius: 9, border: "none",
                        background: saved ? "#10b981" : C,
                        color: "#fff", fontWeight: 600, fontSize: "0.85rem",
                        fontFamily: "inherit", cursor: "pointer", transition: "all .2s",
                        boxShadow: `0 4px 14px ${saved ? "#10b98140" : `${C}40`}`,
                    }}
                >
                    {saved ? "✓ Saved!" : "Save Changes"}
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>

                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: C, display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.4rem",
                            color: "#fff", margin: "0 auto 10px",
                            boxShadow: `0 4px 20px ${C}50`,
                        }}>
                            {profile.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{profile.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2, wordBreak: "break-all" }}>{profile.email}</div>

                        <div style={{
                            display: "inline-block", marginTop: 8, padding: "2px 10px",
                            borderRadius: 20, fontSize: "0.7rem", fontWeight: 600,
                            background: `${roleColor}18`, color: roleColor,
                            border: `1px solid ${roleColor}33`, textTransform: "capitalize",
                        }}>
                            {profile.role.replace("_", " ")}
                        </div>
                    </div>

                    <nav style={{ padding: "8px" }}>
                        {tabs.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                                    padding: "9px 12px", borderRadius: 8, border: "none",
                                    background: tab === t.key ? C : "transparent",
                                    color: tab === t.key ? "#fff" : "var(--text-secondary)",
                                    fontSize: "0.84rem", fontFamily: "inherit",
                                    fontWeight: tab === t.key ? 600 : 400,
                                    cursor: "pointer", transition: "all .15s", textAlign: "left",
                                }}
                                onMouseEnter={e => { if (tab !== t.key) { e.currentTarget.style.background = "var(--bg-card-hover)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                                onMouseLeave={e => { if (tab !== t.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                            >
                                <TabIcon active={tab === t.key}>{t.icon}</TabIcon>
                                {t.label}
                            </button>

                        ))}

                        <div style={{ borderTop: "1px solid #141418", marginTop: 8, paddingTop: 8 }}>
                            <button
                                onClick={() => { logout(); navigate("/"); }}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                                    padding: "9px 12px", borderRadius: 8, border: "none",
                                    background: "transparent", color: "#ef4444",
                                    fontSize: "0.84rem", fontFamily: "inherit", cursor: "pointer", transition: "all .15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                Sign Out
                            </button>
                        </div>
                    </nav>
                </div>

                <div>
                    {tab === "profile" && (
                        <div className="card">
                            <h4 style={{ margin: "0 0 20px 0", fontFamily: "'Space Grotesk',sans-serif", fontSize: "1rem" }}>Profile Information</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {[
                                    { label: "Full Name", key: "name", type: "text" },
                                    { label: "Email Address", key: "email", type: "email" },
                                    { label: "Phone Number", key: "phone", type: "tel" },
                                    { label: "Department", key: "department", type: "text" },
                                    { label: "Location", key: "location", type: "text" },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={labelStyle}>{f.label}</label>
                                        <input
                                            type={f.type}
                                            value={profile[f.key]}
                                            onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = `${C}60`}
                                            onBlur={e => e.target.style.borderColor = "var(--border)"}
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label style={labelStyle}>Role</label>
                                    <select
                                        value={profile.role}
                                        onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
                                        style={{ ...inputStyle, cursor: "pointer" }}
                                        onFocus={e => e.target.style.borderColor = `${C}60`}
                                        onBlur={e => e.target.style.borderColor = "#1c1c22"}
                                    >
                                        <option value="manager">Manager</option>
                                        <option value="dispatcher">Dispatcher</option>
                                        <option value="safety_officer">Safety Officer</option>
                                        <option value="analyst">Analyst</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: 24, padding: "16px", background: "var(--bg-secondary)", borderRadius: 10, border: "1px solid var(--border)" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Account Stats</div>

                                <div style={{ display: "flex", gap: 32 }}>
                                    {[
                                        { label: "Member Since", value: "Jan 2025" },
                                        { label: "Last Login", value: "Today, 12:19 PM" },
                                        { label: "Sessions", value: "142" },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: C }}>{s.value}</div>
                                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                                        </div>

                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "preferences" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="card">
                                <h4 style={{ margin: "0 0 16px 0", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem" }}>Display Settings</h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    {[
                                        { label: "Language", key: "language", options: [{ v: "en", l: "English" }, { v: "hi", l: "Hindi" }, { v: "gu", l: "Gujarati" }] },
                                        { label: "Timezone", key: "timezone", options: [{ v: "Asia/Kolkata", l: "IST (UTC+5:30)" }, { v: "UTC", l: "UTC" }] },
                                        { label: "Currency", key: "currency", options: [{ v: "INR", l: "₹ Indian Rupee" }, { v: "USD", l: "$ US Dollar" }] },
                                        { label: "Distance Unit", key: "distanceUnit", options: [{ v: "km", l: "Kilometres" }, { v: "mi", l: "Miles" }] },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label style={labelStyle}>{f.label}</label>
                                            <select
                                                value={prefs[f.key]}
                                                onChange={e => setPrefs(p => ({ ...p, [f.key]: e.target.value }))}
                                                style={{ ...inputStyle, cursor: "pointer" }}
                                                onFocus={e => e.target.style.borderColor = `${C}60`}
                                                onBlur={e => e.target.style.borderColor = "#1c1c22"}
                                            >
                                                {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <Toggle label="Lite Mode (Light Theme)" value={theme === 'light'} onChange={() => toggleTheme()} />
                                    <Toggle label="Compact Mode (denser layout)" value={prefs.compactMode} onChange={v => setPrefs(p => ({ ...p, compactMode: v }))} />
                                </div>
                            </div>


                            <div className="card">
                                <h4 style={{ margin: "0 0 4px 0", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem" }}>Notification Preferences</h4>
                                <Toggle label="Email Alerts" value={prefs.emailAlerts} onChange={v => setPrefs(p => ({ ...p, emailAlerts: v }))} />
                                <Toggle label="Maintenance Due Alerts" value={prefs.maintenanceAlerts} onChange={v => setPrefs(p => ({ ...p, maintenanceAlerts: v }))} />
                                <Toggle label="Trip Status Alerts" value={prefs.tripAlerts} onChange={v => setPrefs(p => ({ ...p, tripAlerts: v }))} />
                                <Toggle label="Driver License Expiry Alerts" value={prefs.licenseAlerts} onChange={v => setPrefs(p => ({ ...p, licenseAlerts: v }))} />
                                <Toggle label="Weekly Summary Report" value={prefs.weeklyReport} onChange={v => setPrefs(p => ({ ...p, weeklyReport: v }))} />
                            </div>
                        </div>
                    )}

                    {tab === "security" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="card">
                                <h4 style={{ margin: "0 0 16px 0", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem" }}>Change Password</h4>
                                {["Current Password", "New Password", "Confirm New Password"].map(lbl => (
                                    <div key={lbl} style={{ marginBottom: 14 }}>
                                        <label style={labelStyle}>{lbl}</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = `${C}60`}
                                            onBlur={e => e.target.style.borderColor = "#1c1c22"}
                                        />
                                    </div>
                                ))}
                                <button onClick={handleSave} style={{
                                    marginTop: 4, padding: "9px 20px", borderRadius: 9, border: `1px solid ${C}`,
                                    background: "transparent", color: C, fontWeight: 600, fontSize: "0.84rem",
                                    fontFamily: "inherit", cursor: "pointer", transition: "all .15s",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `${C}15`; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    Update Password
                                </button>
                            </div>

                            <div className="card">
                                <h4 style={{ margin: "0 0 4px 0", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem" }}>Active Sessions</h4>
                                {[
                                    { device: "Chrome on Windows", location: "Ahmedabad, IN", time: "Active now", current: true },
                                    { device: "Mobile — Android", location: "Surat, IN", time: "2 days ago", current: false },
                                ].map((s, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #141418" }}>
                                        <div>
                                            <div style={{ fontSize: "0.84rem", color: "#d0d0d0", fontWeight: 500 }}>{s.device}</div>
                                            <div style={{ fontSize: "0.72rem", color: "#444", marginTop: 2 }}>{s.location} · {s.time}</div>
                                        </div>
                                        {s.current
                                            ? <span style={{ fontSize: "0.7rem", color: "#22c55e", background: "#22c55e18", padding: "2px 8px", borderRadius: 20, border: "1px solid #22c55e30" }}>Current</span>
                                            : <button style={{ fontSize: "0.75rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Revoke</button>
                                        }
                                    </div>
                                ))}
                            </div>

                            <div className="card" style={{ borderLeft: "3px solid #ef4444" }}>
                                <h4 style={{ margin: "0 0 8px 0", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem", color: "#ef4444" }}>Danger Zone</h4>
                                <p style={{ fontSize: "0.82rem", color: "#555", margin: "0 0 14px 0" }}>These actions are irreversible. Please proceed with caution.</p>
                                <button style={{
                                    padding: "8px 18px", borderRadius: 8, border: "1px solid #ef4444",
                                    background: "transparent", color: "#ef4444", fontWeight: 600,
                                    fontSize: "0.82rem", fontFamily: "inherit", cursor: "pointer",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
