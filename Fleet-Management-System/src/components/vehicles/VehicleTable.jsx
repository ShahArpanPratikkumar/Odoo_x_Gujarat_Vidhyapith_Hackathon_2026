import { useState } from "react";
import { useFleet } from "../../context/FleetContext";
import EditVehicleModal from "./EditVehicleModal";

const statusStyle = {
  "Active": { class: "badge-success" },
  "In Service": { class: "badge-warning" },
  "Inactive": { class: "badge-muted" },
};

export default function VehicleTable({ search = "", filter = "All" }) {
  const { vehicles, deleteVehicle } = useFleet();
  const [editing, setEditing] = useState(null);

  const filtered = vehicles.filter(v => {
    const matchFilter = filter === "All" || v.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || v.plate.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <>
      <div className="table-wrapper">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>Plate No.</th>
              <th>Make / Model</th>
              <th>Type</th>
              <th>Year</th>
              <th>Mileage</th>
              <th>Driver</th>
              <th>Last Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No vehicles found</td></tr>
            ) : filtered.map(v => (
              <tr key={v.id}>
                <td>
                  <span style={{ fontFamily: "monospace", background: "var(--bg-secondary)", padding: "3px 8px", borderRadius: "var(--r-sm)", fontSize: "0.82rem", color: "var(--accent-light)" }}>
                    {v.plate}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{v.make}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{v.model}</div>
                </td>
                <td style={{ color: "var(--text-secondary)" }}>{v.type}</td>
                <td style={{ color: "var(--text-secondary)" }}>{v.year}</td>
                <td style={{ color: "var(--text-secondary)" }}>{v.mileage.toLocaleString()} km</td>
                <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{v.driver}</td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{v.lastService}</td>
                <td><span className={`badge ${statusStyle[v.status]?.class || "badge-muted"}`}>{v.status}</span></td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon" title="Edit" onClick={() => setEditing(v)}>✏️</button>
                    <button className="btn-icon" title="Delete" onClick={() => { if (window.confirm(`Delete ${v.plate}?`)) deleteVehicle(v.id); }} style={{ color: "var(--danger)" }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Showing {filtered.length} of {vehicles.length} vehicles
      </div>
      {editing && <EditVehicleModal vehicle={editing} onClose={() => setEditing(null)} />}
    </>
  );
}