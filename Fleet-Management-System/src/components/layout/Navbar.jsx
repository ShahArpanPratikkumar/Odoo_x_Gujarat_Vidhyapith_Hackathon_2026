import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useFleet } from "../../context/FleetContext";



const C = "#4f46e5";

const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const ChevDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
const LogoutIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const MenuIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
const SunIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
const MoonIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;


function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <rect width="72" height="72" rx="18" fill={C} />
      <rect x="14" y="19" width="44" height="8" rx="4" fill="white" opacity="0.9" />
      <rect x="30" y="19" width="12" height="24" rx="4" fill="white" opacity="0.9" />
      <path d="M18 48 L36 55 L54 48" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" fill="none" />
    </svg>
  );
}

const PAGE_LABELS = {
  "/dashboard": "Dashboard", "/vehicles": "Vehicles", "/drivers": "Drivers",
  "/trips": "Trips", "/maintenance": "Maintenance", "/reports": "Reports",
  "/fuel-logs": "Fuel Logs", "/settings": "Settings"
};


const NOTIFS_DATA = [
  { id: 1, text: "GJ-18-EF-9012 engine overhaul overdue", time: "2m ago", col: "#ef4444", unread: true },
  { id: 2, text: "New trip Ahmedabad → Surat scheduled", time: "18m ago", col: C, unread: true },
  { id: 3, text: "Kiran Desai completed trip to Jamnagar", time: "1h ago", col: "#22c55e", unread: true },
];

export default function Navbar({ onMenuClick }) {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useFleet();

  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFS_DATA);

  const pageLabel = PAGE_LABELS[location.pathname] || "Transvora";
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "FM";
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: "var(--navbar-h)",
      background: "var(--bg-primary)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 20px 0 0", zIndex: 100,
    }}>



      <div
        className="navbar-logo-zone"
        style={{ width: "var(--sidebar-w)", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", height: "100%", flexShrink: 0, borderRight: "1px solid var(--border)" }}
      >


        <button
          onClick={onMenuClick}
          className="navbar-hamburger"
          style={{
            display: "none",
            background: "none", border: "none",
            color: "#888", cursor: "pointer",
            padding: "4px", marginRight: 4, flexShrink: 0,
          }}
        >
          <MenuIcon />
        </button>
        <LogoMark size={32} />
        <div className="navbar-brand-text">
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>Transvora</div>
          <div style={{ fontSize: "0.56rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>Fleet Intelligence</div>
        </div>
      </div>



      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, padding: "0 20px" }}>

        <div className="navbar-breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Transvora</span>
          <span style={{ color: "var(--border)", fontSize: "0.9rem" }}>/</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: C, background: `${C}18`, padding: "2px 10px", borderRadius: 20, border: `1px solid ${C}30` }}>{pageLabel}</span>
        </div>



        <div
          className="navbar-search"
          style={{ flex: 1, maxWidth: 340, display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "7px 14px", transition: "all .18s" }}
          onFocus={e => { e.currentTarget.style.borderColor = `${C}60`; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          tabIndex={-1}
        >

          <span style={{ color: "#333", flexShrink: 0 }}><SearchIcon /></span>
          <input
            placeholder="Search vehicles, drivers, trips..."
            style={{
              background: "none", border: "none", outline: "none",
              color: "var(--text-primary)", fontSize: "0.82rem",
              fontFamily: "'Inter',sans-serif", width: "100%"
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd style={{ backgroundColor: `${C}15`, border: `1px solid ${C}25`, borderRadius: 5, padding: "1px 6px", fontSize: "0.65rem", color: "#555", fontFamily: "monospace", flexShrink: 0 }}>⌘K</kbd>
        </div>
      </div>


      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>


        <button
          onClick={toggleTheme}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--warning)", cursor: "pointer", transition: "all .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        <div style={{ position: "relative" }}>
          <button onClick={() => { setShowNotif(p => !p); setShowUser(false); }} style={{
            width: 38, height: 38, borderRadius: 10,
            background: showNotif ? `${C}18` : "var(--bg-secondary)",
            border: `1px solid ${showNotif ? `${C}50` : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: showNotif ? C : "var(--text-muted)", cursor: "pointer", position: "relative", transition: "all .15s",
          }}
            onMouseEnter={e => { if (!showNotif) { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = C; } }}
            onMouseLeave={e => { if (!showNotif) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; } }}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--danger)", border: "1.5px solid var(--bg-primary)" }} />
            )}
          </button>



          {showNotif && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 310, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-lg)", zIndex: 200, overflow: "hidden" }}>
              <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>Notifications</span>
                <span
                  onClick={markAllRead}
                  style={{ fontSize: "0.7rem", color: unreadCount > 0 ? C : "var(--text-muted)", fontWeight: 600, cursor: unreadCount > 0 ? "pointer" : "default" }}
                >
                  Mark all read
                </span>
              </div>

              {notifications.map(n => (
                <div key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    gap: 12,
                    cursor: "pointer",
                    transition: "background .14s",
                    background: n.unread ? "var(--accent-glow)" : "transparent"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = n.unread ? "var(--accent-glow)" : "var(--bg-card-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? "var(--accent-glow)" : "transparent"}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.unread ? n.col : "var(--border)", marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.81rem", color: n.unread ? "var(--text-primary)" : "var(--text-secondary)", lineHeight: 1.4, fontWeight: n.unread ? 500 : 400 }}>{n.text}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 3 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "10px 16px", textAlign: "center" }}>
                <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", cursor: "pointer" }}>View all →</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 22, background: "var(--border)", margin: "0 4px" }} />



        <div style={{ position: "relative" }}>
          <button onClick={() => { setShowUser(p => !p); setShowNotif(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "6px 10px 6px 6px",
            background: showUser ? `${C}15` : "var(--bg-secondary)",
            border: `1px solid ${showUser ? `${C}40` : "var(--border)"}`,
            borderRadius: 10, cursor: "pointer", transition: "all .15s",
          }}
            onMouseEnter={e => { if (!showUser) { e.currentTarget.style.background = "var(--bg-card-hover)"; e.currentTarget.style.borderColor = "var(--border-light)"; } }}
            onMouseLeave={e => { if (!showUser) { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; } }}
          >
            <div style={{ position: "relative" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "0.75rem", color: "#fff", boxShadow: `0 2px 10px ${C}50` }}>{initials}</div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "var(--success)", border: "1.5px solid var(--bg-primary)" }} />
            </div>
            <div className="navbar-user-text" style={{ textAlign: "left", lineHeight: 1.25 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>Fleet Manager</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", whiteSpace: "nowrap", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
            </div>
            <span className="navbar-user-text" style={{ color: "var(--text-muted)", marginLeft: 2 }}><ChevDown /></span>
          </button>


          {showUser && (
            <div className="navbar-user-dropdown" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 210, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-lg)", zIndex: 200 }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.88rem" }}>Fleet Manager</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: 2, wordBreak: "break-all" }}>{user?.email}</div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
                  <span style={{ fontSize: "0.68rem", color: "var(--success)" }}>Online</span>
                </div>
              </div>

              {[
                { label: "Profile Settings", path: "/settings" },
                { label: "Preferences", path: "/settings?tab=preferences" },
              ].map(item => (
                <button key={item.label}
                  onClick={() => { navigate(item.path); setShowUser(false); }}
                  style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.83rem", fontFamily: "Inter,sans-serif", cursor: "pointer", transition: "background .14s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >{item.label}</button>
              ))}

              <div style={{ borderTop: "1px solid var(--border)" }}>

                <button onClick={() => { logout(); navigate("/"); }} style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", display: "flex", alignItems: "center", gap: 8, color: "#ef4444", fontSize: "0.83rem", fontFamily: "Inter,sans-serif", cursor: "pointer", transition: "background .14s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                ><LogoutIcon /> Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav >
  );
}