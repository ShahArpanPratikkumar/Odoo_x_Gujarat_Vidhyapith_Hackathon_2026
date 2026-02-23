import Layout from "../components/layout/Layout";
import VehicleTable from "../components/vehicles/VehicleTable";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";

const C = "#4f46e5";

export default function Vehicles() {
  const [filter, setFilter] = useState("All");
  const { searchQuery, setSearchQuery } = useFleet();

  return (
    <Layout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Vehicles</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>Manage and monitor your fleet assets</p>
        </div>
        <button className="btn btn-primary" style={{ background: C, color: "#fff", padding: "10px 20px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 12px ${C}30` }}>
          + Add Vehicle
        </button>
      </div>

      <div className="toolbar" style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, maxWidth: 400 }} className="search-bar">
          <input
            placeholder="Search by plate, make, model..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs" style={{ display: "flex", gap: 6, background: "var(--bg-secondary)", padding: 4, borderRadius: 12, border: "1px solid var(--border)" }}>
          {["All", "Active", "In Service", "Inactive"].map(t => (
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
        <VehicleTable search={searchQuery} filter={filter} />
      </div>
    </Layout>
  );
}