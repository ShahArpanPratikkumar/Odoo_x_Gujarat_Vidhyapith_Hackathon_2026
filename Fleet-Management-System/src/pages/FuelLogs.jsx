import Layout from "../components/layout/Layout";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";

const C = "#4f46e5";

export default function FuelLogs() {
    const { fuelLogs, searchQuery, setSearchQuery } = useFleet();
    const [filter, setFilter] = useState("All");

    const filtered = fuelLogs.filter(log => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = log.vehicle.toLowerCase().includes(query) ||
            log.fuelType.toLowerCase().includes(query) ||
            log.station.toLowerCase().includes(query);
        const matchesFilter = filter === "All" || log.fuelType === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <Layout>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 className="page-title" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Fuel Logs</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>Monitor fuel consumption and efficiency</p>
                </div>
                <button className="btn btn-primary" style={{ background: C, color: "#fff", padding: "10px 20px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 12px ${C}30` }}>
                    + Log Fuel
                </button>
            </div>

            <div className="toolbar" style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, maxWidth: 400 }} className="search-bar">
                    <input
                        placeholder="Search vehicle, station, type..."
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-tabs" style={{ display: "flex", gap: 6, background: "var(--bg-secondary)", padding: 4, borderRadius: 12, border: "1px solid var(--border)" }}>
                    {["All", "Diesel", "Petrol", "CNG", "Electric"].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className="filter-tab"
                            style={{
                                padding: "7px 14px", borderRadius: 8, border: "none", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                                background: filter === t ? "var(--bg-card)" : "transparent",
                                color: filter === t ? C : "var(--text-muted)",
                                boxShadow: filter === t ? "var(--shadow-sm)" : "none",
                                transition: "all .15s"
                            }}
                        >{t}</button>
                    ))}
                </div>
            </div>

            <div className="table-wrapper">
                <table className="fleet-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--bg-secondary)" }}>
                            {["Date", "Vehicle", "Fuel Type", "Quantity", "Cost", "Station"].map(h => (
                                <th key={h} style={{ padding: "12px 18px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(log => (
                            <tr key={log.id} style={{ borderTop: "1px solid var(--border)", transition: "background .12s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "14px 18px", color: "var(--text-secondary)", fontSize: "0.82rem" }}>{log.date}</td>
                                <td style={{ padding: "14px 18px" }}>
                                    <span style={{ fontFamily: "monospace", background: `${C}12`, color: C, padding: "2px 7px", borderRadius: 5, fontSize: "0.78rem", border: `1px solid ${C}25` }}>{log.vehicle}</span>
                                </td>
                                <td style={{ padding: "14px 18px", color: "var(--text-secondary)", fontSize: "0.82rem" }}>{log.fuelType}</td>
                                <td style={{ padding: "14px 18px" }}>
                                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem" }}>{log.quantity} L</div>
                                </td>
                                <td style={{ padding: "14px 18px", color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 600 }}>₹{log.cost.toLocaleString()}</td>
                                <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: "0.82rem" }}>{log.station}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
