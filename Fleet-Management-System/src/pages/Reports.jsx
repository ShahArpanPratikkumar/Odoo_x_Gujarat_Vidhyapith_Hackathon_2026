import Layout from "../components/layout/Layout";
import { useFleet } from "../context/FleetContext";
import FuelEfficiencyChart from "../components/reports/FuelEfficiencyChart";
import ROIChart from "../components/reports/ROIChart";

const C = "#4f46e5";

export default function Reports() {
    const { vehicles, trips, maintenance, searchQuery } = useFleet();

    const totalRevenue = trips.filter(t => t.status === "Completed").reduce((s, t) => s + t.cost, 0);
    const totalMaintCost = maintenance.reduce((s, m) => s + m.cost, 0);
    const netROI = totalRevenue - totalMaintCost;
    const avgTripDist = trips.length ? (trips.reduce((s, t) => s + t.distance, 0) / trips.length).toFixed(0) : 0;

    const query = searchQuery.toLowerCase().trim();
    const filteredVehicles = vehicles.filter(v =>
        !query ||
        v.plate.toLowerCase().includes(query) ||
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query)
    );

    return (
        <Layout>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 className="page-title" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Analytics & Reports</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>Fleet performance insights and financial overview</p>
                </div>
                <button className="btn btn-secondary" onClick={() => window.print()} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "10px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
                    🖨️ Print Report
                </button>
            </div>

            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                {[
                    {
                        label: "Total Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}K`, color: "#10b981",
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    },
                    {
                        label: "Maintenance Cost", value: `₹${(totalMaintCost / 1000).toFixed(1)}K`, color: "#ef4444",
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                    },
                    {
                        label: "Net ROI", value: `₹${(netROI / 1000).toFixed(1)}K`, color: netROI >= 0 ? "#10b981" : "#ef4444",
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                    },
                    {
                        label: "Avg Trip Distance", value: `${avgTripDist} km`, color: "#3b82f6",
                        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    },
                ].map(kpi => (
                    <div key={kpi.label} className="card" style={{ borderLeft: `3px solid ${kpi.color}`, padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{kpi.label}</div>
                                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{kpi.value}</div>
                            </div>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: `${kpi.color}15`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: kpi.color, flexShrink: 0,
                            }}>
                                {kpi.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="charts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px" }}>
                    <FuelEfficiencyChart />
                </div>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px" }}>
                    <ROIChart />
                </div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginTop: 24 }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Vehicle Performance Overview</h3>
                </div>
                <div className="table-wrapper">
                    <table className="fleet-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-secondary)" }}>
                                {["Vehicle", "Type", "Mileage", "Trips", "Revenue", "Status"].map(h => (
                                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.map(v => {
                                const vTrips = trips.filter(t => t.vehicle === v.plate && t.status === "Completed");
                                const vRevenue = vTrips.reduce((s, t) => s + t.cost, 0);
                                return (
                                    <tr key={v.id} style={{ borderTop: "1px solid var(--border)", transition: "background .12s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <td style={{ padding: "14px 18px" }}>
                                            <span style={{ fontFamily: "monospace", background: `${C}12`, color: C, padding: "2px 7px", borderRadius: 5, fontSize: "0.78rem", border: `1px solid ${C}25` }}>{v.plate}</span>
                                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{v.make} {v.model}</div>
                                        </td>
                                        <td style={{ padding: "14px 18px", color: "var(--text-secondary)", fontSize: "0.82rem" }}>{v.type}</td>
                                        <td style={{ padding: "14px 18px", color: "var(--text-secondary)", fontSize: "0.82rem" }}>{v.mileage.toLocaleString()} km</td>
                                        <td style={{ padding: "14px 18px", color: "var(--text-secondary)", fontSize: "0.82rem" }}>{vTrips.length}</td>
                                        <td style={{ padding: "14px 18px", color: "#10b981", fontSize: "0.85rem", fontWeight: 600 }}>{vRevenue > 0 ? `₹${vRevenue.toLocaleString()}` : "—"}</td>
                                        <td style={{ padding: "14px 18px" }}>
                                            <span style={{
                                                padding: "4px 10px", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700,
                                                background: v.status === "Active" ? "var(--success-bg)" : v.status === "In Service" ? "var(--warning-bg)" : "var(--bg-secondary)",
                                                color: v.status === "Active" ? "var(--success)" : v.status === "In Service" ? "var(--warning)" : "var(--text-muted)",
                                                border: v.status === "Active" ? "1px solid var(--success)30" : v.status === "In Service" ? "1px solid var(--warning)30" : "1px solid var(--border)"
                                            }}>
                                                {v.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
