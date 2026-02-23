import { useState } from "react";
import { useFleet } from "../../context/FleetContext";

export default function MaintenanceForm({ onClose }) {
    const { addMaintenance, vehicles } = useFleet();
    const [form, setForm] = useState({
        vehicle: "", type: "Oil Change", date: new Date().toISOString().slice(0, 10),
        status: "Scheduled", cost: "", priority: "Normal", technician: "",
    });
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.vehicle || !form.type) return;
        addMaintenance({ ...form, cost: parseInt(form.cost) || 0 });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">🔧 Schedule Maintenance</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Vehicle *</label>
                                <select className="form-select" value={form.vehicle} onChange={e => set("vehicle", e.target.value)} required>
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => <option key={v.id} value={v.plate}>{v.plate} — {v.make} {v.model}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Service Type *</label>
                                <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                                    {["Oil Change", "Tyre Replacement", "Tyre Rotation", "Engine Overhaul", "Brake Service", "AC Repair", "Filter Change", "Full Inspection", "Battery Replacement", "Other"].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Scheduled Date</label>
                                <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select className="form-select" value={form.priority} onChange={e => set("priority", e.target.value)}>
                                    {["Normal", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Estimated Cost (₹)</label>
                                <input className="form-input" type="number" placeholder="0" value={form.cost} onChange={e => set("cost", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Technician / Workshop</label>
                                <input className="form-input" placeholder="e.g. Ravi Auto Works" value={form.technician} onChange={e => set("technician", e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Schedule</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
