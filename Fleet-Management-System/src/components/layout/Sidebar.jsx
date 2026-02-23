import { Link, useLocation } from "react-router-dom";

const C = "#4f46e5";

const Icons = {
  Dashboard: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Vehicles: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  Drivers: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Trips: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  Maintenance: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  FuelLogs: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" /><path d="M14 10h2a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1v-6.4a2 2 0 0 0-.6-1.4L19 6" /><line x1="3" y1="22" x2="14" y2="22" /><line x1="3" y1="10" x2="14" y2="10" /></svg>,
  Reports: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
};

const NAV = [
  { path: "/dashboard", key: "Dashboard" },
  { path: "/vehicles", key: "Vehicles" },
  { path: "/drivers", key: "Drivers" },
  { path: "/trips", key: "Trips" },
  { path: "/maintenance", key: "Maintenance" },
  { path: "/fuel-logs", key: "FuelLogs", label: "Fuel Logs" },
  { path: "/reports", key: "Reports" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)", zIndex: 85 }}
        />
      )}

      <aside
        className={isOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed"}
        style={{
          position: "fixed", top: "var(--navbar-h)", left: 0, bottom: 0,
          width: "var(--sidebar-w)",
          background: "var(--bg-primary)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          padding: "16px 10px",
          zIndex: 90, overflowY: "auto",
          transition: "transform .3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            const Icon = Icons[item.key];
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 9,
                  textDecoration: "none",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "0.86rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "var(--text-secondary)",
                  background: active ? C : "transparent",
                  transition: "all .15s ease",
                  letterSpacing: active ? "-0.01em" : "0",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-card-hover)"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; } }}

              >
                <span style={{ color: active ? "rgba(255,255,255,0.85)" : "var(--text-muted)", display: "flex", flexShrink: 0 }}><Icon /></span>

                <span>{item.label || item.key}</span>
                {active && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: C }}>Transvora v1.0</div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>Fleet Management</div>
        </div>

      </aside>
    </>
  );
}