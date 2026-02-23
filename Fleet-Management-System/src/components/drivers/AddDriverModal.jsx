import { useState } from "react";
import { useFleet } from "../../context/FleetContext";

export default function AddDriverModal({ onClose }) {
    const { addDriver } = useFleet();
    const [form, setForm] = useState({
        name: "", license: "", phone: "", email: "", status: "Active", vehicle: "Unassigned", joined: new Date().toISOString().slice(0, 10),
    });
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.license) return;
        addDriver(form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">👤 Add New Driver</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" placeholder="e.g. Ramesh Patel" value={form.name} onChange={e => set("name", e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">License Number *</label>
                                <input className="form-input" placeholder="GJD20230001" value={form.license} onChange={e => set("license", e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" placeholder="9876543210" value={form.phone} onChange={e => set("phone", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="driver@fleetpro.in" value={form.email} onChange={e => set("email", e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={e => set("status", e.target.value)}>
                                    {["Active", "Off Duty"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Vehicle Assigned</label>
                                <input className="form-input" placeholder="Plate no. or Unassigned" value={form.vehicle} onChange={e => set("vehicle", e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Driver</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
