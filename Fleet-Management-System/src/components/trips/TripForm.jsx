import { useState } from "react";
import { useFleet } from "../../context/FleetContext";

export default function TripForm({ onClose }) {
    const { addTrip, vehicles, drivers } = useFleet();
    const [form, setForm] = useState({
        origin: "", destination: "", driver: "", vehicle: "",
        date: new Date().toISOString().slice(0, 10), distance: "", cost: "", status: "Scheduled",
    });
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.origin || !form.destination || !form.driver) return;
        addTrip({ ...form, distance: parseInt(form.distance) || 0, cost: parseInt(form.cost) || 0 });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">🗺️ New Trip</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Origin *</label>
                                <input className="form-input" placeholder="e.g. Ahmedabad" value={form.origin} onChange={e => set("origin", e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Destination *</label>
                                <input className="form-input" placeholder="e.g. Surat" value={form.destination} onChange={e => set("destination", e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Driver *</label>
                                <select className="form-select" value={form.driver} onChange={e => set("driver", e.target.value)} required>
                                    <option value="">Select Driver</option>
                                    {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Vehicle</label>
                                <select className="form-select" value={form.vehicle} onChange={e => set("vehicle", e.target.value)}>
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => <option key={v.id} value={v.plate}>{v.plate} — {v.make} {v.model}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Trip Date</label>
                                <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Distance (km)</label>
                                <input className="form-input" type="number" placeholder="0" value={form.distance} onChange={e => set("distance", e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Cost (₹)</label>
                                <input className="form-input" type="number" placeholder="0" value={form.cost} onChange={e => set("cost", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={e => set("status", e.target.value)}>
                                    {["Scheduled", "In Progress", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Trip</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
