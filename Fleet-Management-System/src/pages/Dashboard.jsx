import Layout from "../components/layout/Layout";
import { useFleet } from "../context/FleetContext";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

const C = "#4f46e5";
const CL = "#6366f1";


const Ic = {
  Truck: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  User: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Route: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  Money: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  Alert: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Arrow: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  Wrench: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  Chart: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  Pin: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
};


const SPARK = {
  vehicles: [{ v: 6 }, { v: 7 }, { v: 7 }, { v: 8 }, { v: 8 }, { v: 8 }],
  drivers: [{ v: 5 }, { v: 5 }, { v: 6 }, { v: 6 }, { v: 7 }, { v: 5 }],
  trips: [{ v: 3 }, { v: 5 }, { v: 6 }, { v: 9 }, { v: 10 }, { v: 12 }],
  revenue: [{ v: 8 }, { v: 11 }, { v: 14 }, { v: 13 }, { v: 16 }, { v: 15.7 }],
};


const SBADGE = {
  "Completed": { bg: "var(--success-bg)", bd: "var(--success)40", c: "var(--success)" },
  "In Progress": { bg: "var(--accent-glow)", bd: "var(--accent)40", c: "var(--accent-light)" },
  "Scheduled": { bg: "var(--bg-secondary)", bd: "var(--border)", c: "var(--text-secondary)" },
  "Cancelled": { bg: "var(--danger-bg)", bd: "var(--danger)40", c: "var(--danger)" },
};

function Pill({ s }) {
  const t = SBADGE[s] || SBADGE["Scheduled"];
  return <span style={{ padding: "3px 10px", borderRadius: 99, background: t.bg, border: `1px solid ${t.bd}`, color: t.c, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>{s}</span>;
}


function MetricCard({ icon, label, value, sub, up, trendPct, accent, sparkData }) {
  const ac = accent || C;
  // Use a clean ID for gradients to avoid issues with spaces
  const gradientId = `sg-${label.replace(/\s+/g, '-')}`;

  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14,
      padding: "18px 18px 0", overflow: "hidden", position: "relative",
      transition: "border-color .2s,transform .2s,box-shadow .2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >

      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: ac, borderRadius: "14px 0 0 14px" }} />

      <div style={{ paddingLeft: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${ac}15`, border: `1px solid ${ac}25`, display: "flex", alignItems: "center", justifyContent: "center", color: ac }}>{icon}</div>
          {trendPct && (
            <div style={{ padding: "2px 8px", borderRadius: 99, background: up ? "var(--success-bg)" : "var(--danger-bg)", border: `1px solid ${up ? "var(--success)" : "var(--danger)"}40`, color: up ? "var(--success)" : "var(--danger)", fontSize: "0.68rem", fontWeight: 700 }}>
              {up ? "↑" : "↓"} {trendPct}
            </div>
          )}
        </div>
        <div style={{ fontSize: "0.66rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.09em" }}>{label}</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 4 }}>{value}</div>
        <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: 4, marginBottom: 14 }}>{sub}</div>
      </div>


      {sparkData && (
        <ResponsiveContainer width="100%" height={46}>
          <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ac} stopOpacity={0.2} />
                <stop offset="100%" stopColor={ac} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={ac} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}



const PIE_COLS = [C, "#555", "#ef4444"];
function FleetDonut({ active, inService, inactive }) {
  const data = [
    { name: "Active", value: active },
    { name: "In Service", value: inService || 1 },
    { name: "Inactive", value: inactive || 1 },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div style={{ width: 110, height: 110 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={32} outerRadius={52} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={PIE_COLS[i]} />)}
            </Pie>
            <RTooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: "0.78rem", color: "var(--text-primary)" }} itemStyle={{ color: "var(--text-primary)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 18, borderRadius: 99, background: PIE_COLS[i] }} />
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{d.name}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem", lineHeight: 1 }}>{d.value}</div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}


function ActionTile({ icon, label, sub, accent, onClick }) {
  const ac = accent || C;
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
      background: "var(--bg-secondary)", border: "1px solid var(--border)",
      borderRadius: 10, width: "100%", cursor: "pointer", textAlign: "left",
      transition: "all .15s", fontFamily: "inherit",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-card-hover)"; e.currentTarget.style.borderColor = `${ac}40`; e.currentTarget.style.transform = "translateX(2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
    >

      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${ac}15`, border: `1px solid ${ac}25`, display: "flex", alignItems: "center", justifyContent: "center", color: ac, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        {sub && <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: 1 }}>{sub}</div>}
      </div>
      <span style={{ color: "var(--text-muted)" }}><Ic.Arrow /></span>

    </button>
  );
}


export default function Dashboard() {
  const { vehicles, drivers, trips, maintenance, searchQuery } = useFleet();
  const navigate = useNavigate();

  const query = searchQuery.toLowerCase().trim();

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const activeV = vehicles.filter(v => v.status === "Active").length;
  const inServiceV = vehicles.filter(v => v.status === "In Service").length;
  const inactiveV = vehicles.filter(v => v.status === "Inactive").length;
  const activeD = drivers.filter(d => d.status === "Active" || d.status === "On Trip").length;
  const completedT = trips.filter(t => t.status === "Completed");
  const totalRev = completedT.reduce((s, t) => s + t.cost, 0);
  const inProgT = trips.filter(t => t.status === "In Progress").length;
  const overdues = maintenance.filter(m => m.priority === "Overdue" || m.status === "Overdue");
  const criticals = maintenance.filter(m => m.priority === "Critical");

  const filteredTrips = trips.filter(t => {
    const v = vehicles.find(vh => vh.plate === t.vehicle);
    const vehicleName = v ? `${v.make} ${v.model}`.toLowerCase() : "";
    return (
      t.origin.toLowerCase().includes(query) ||
      t.destination.toLowerCase().includes(query) ||
      t.driver.toLowerCase().includes(query) ||
      t.vehicle.toLowerCase().includes(query) ||
      vehicleName.includes(query)
    );
  });

  const recentTrips = [...filteredTrips].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const urgentMaintenance = [...overdues, ...criticals].filter(m => {
    const v = vehicles.find(vh => vh.plate === m.vehicle);
    const vehicleName = v ? `${v.make} ${v.model}`.toLowerCase() : "";
    return (
      m.vehicle.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query) ||
      vehicleName.includes(query)
    );
  });


  const kpis = [
    { icon: <Ic.Truck />, label: "Total Vehicles", value: vehicles.length, sub: `${activeV} active · ${inServiceV} service`, up: true, trendPct: "5%", accent: C, sparkData: SPARK.vehicles },
    { icon: <Ic.User />, label: "Active Drivers", value: activeD, sub: `of ${drivers.length} total`, up: true, trendPct: "2%", accent: "#22c55e", sparkData: SPARK.drivers },
    { icon: <Ic.Route />, label: "Trips This Month", value: trips.length, sub: `${inProgT} in progress`, up: true, trendPct: "12%", accent: C, sparkData: SPARK.trips },
    { icon: <Ic.Money />, label: "Revenue", value: `₹${(totalRev / 1000).toFixed(1)}K`, sub: "from completed trips", up: true, trendPct: "8%", accent: "#22c55e", sparkData: SPARK.revenue },
    { icon: <Ic.Alert />, label: "Alerts", value: overdues.length + criticals.length, sub: `${overdues.length} overdue · ${criticals.length} critical`, trendPct: null, accent: "#ef4444" },
  ];

  const btnBase = { border: "none", borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter',sans-serif", fontSize: "0.83rem", fontWeight: 500, transition: "all .15s" };

  return (
    <Layout>


      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 3, height: 28, background: C, borderRadius: 99 }} />
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", margin: 0 }}>Command Center</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginLeft: 13 }}>Fleet overview · {today}</p>

        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <button onClick={() => navigate("/reports")} style={{ ...btnBase, padding: "8px 15px", background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
          >
            <Ic.Chart /> Reports
          </button>

          <button onClick={() => navigate("/trips")} style={{ ...btnBase, padding: "8px 16px", background: C, color: "#fff", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", boxShadow: `0 4px 14px ${C}40` }}
            onMouseEnter={e => { e.currentTarget.style.background = CL; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C; e.currentTarget.style.transform = "none"; }}
          >
            <Ic.Plus /> New Trip
          </button>
        </div>
      </div>


      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        {kpis.map(k => <MetricCard key={k.label} {...k} />)}
      </div>


      <div className="dashboard-content-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>


        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>


          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.94rem" }}>Recent Trips</div>
                <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: 2 }}>Latest fleet movements</div>
              </div>
              <button onClick={() => navigate("/trips")} style={{ background: "none", border: "none", color: C, fontSize: "0.79rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                View All <Ic.Arrow />
              </button>
            </div>

            <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    {["Route", "Driver", "Vehicle", "Dist.", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {recentTrips.map((t, i) => (
                    <tr key={t.id} style={{ borderTop: "1px solid var(--border)", transition: "background .12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.84rem" }}>{t.origin}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.73rem", marginTop: 1, display: "flex", alignItems: "center", gap: 3 }}><Ic.Pin />{t.destination}</div>
                      </td>

                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: C, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                            {t.driver.charAt(0)}
                          </div>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.81rem", whiteSpace: "nowrap" }}>{t.driver.split(" ")[0]}</span>
                        </div>

                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ fontFamily: "monospace", background: `${C}12`, color: CL, padding: "2px 7px", borderRadius: 5, fontSize: "0.74rem", border: `1px solid ${C}25` }}>{t.vehicle}</span>
                      </td>
                      <td style={{ padding: "12px 18px", color: "var(--text-secondary)", fontSize: "0.81rem" }}>{t.distance} km</td>

                      <td style={{ padding: "12px 18px" }}><Pill s={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {urgentMaintenance.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: `3px solid var(--danger)`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--danger)", animation: "pulse 2s infinite" }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.93rem" }}>Urgent Maintenance</span>
                </div>
                <span style={{ background: "var(--danger-bg)", border: "1px solid var(--danger)40", color: "var(--danger)", fontSize: "0.68rem", fontWeight: 700, padding: "2px 9px", borderRadius: 99 }}>
                  {urgentMaintenance.length} pending
                </span>
              </div>

              <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 8 }}>
                {urgentMaintenance.slice(0, 4).map(m => (
                  <div key={m.id} style={{ padding: "11px 13px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderLeft: `2px solid ${m.priority === "Overdue" ? "var(--danger)" : "var(--warning)"}`, borderRadius: 9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.74rem", color: CL, background: `${C}12`, padding: "1px 5px", borderRadius: 4 }}>{m.vehicle}</span>
                      <span style={{ fontSize: "0.62rem", fontWeight: 800, color: m.priority === "Overdue" ? "var(--danger)" : "var(--warning)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.priority}</span>
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{m.type}</div>
                    <div style={{ fontSize: "0.71rem", color: "var(--text-muted)", marginTop: 2 }}>{m.date}</div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>


        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>


          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem", marginBottom: 3 }}>Fleet Distribution</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 14 }}>Live vehicle breakdown</div>
            <FleetDonut active={activeV} inService={inServiceV} inactive={inactiveV} />
          </div>



          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem" }}>Quick Actions</div>
            </div>

            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { icon: <Ic.Truck />, label: "Add Vehicle", sub: "Register a new vehicle", accent: C, path: "/vehicles" },
                { icon: <Ic.User />, label: "Register Driver", sub: "Onboard a new driver", accent: "#22c55e", path: "/drivers" },
                { icon: <Ic.Wrench />, label: "Schedule Service", sub: "Plan maintenance", accent: "#eab308", path: "/maintenance" },
                { icon: <Ic.Chart />, label: "Fleet Analytics", sub: "View reports", accent: C, path: "/reports" },
              ].map(a => <ActionTile key={a.label} {...a} onClick={() => navigate(a.path)} />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}