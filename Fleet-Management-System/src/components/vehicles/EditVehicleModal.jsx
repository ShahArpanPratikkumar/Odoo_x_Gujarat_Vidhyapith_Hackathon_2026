import { useState } from "react";
import { useFleet } from "../../context/FleetContext";

export default function EditVehicleModal({ vehicle, onClose }) {
    const { updateVehicle } = useFleet();
    const [form, setForm] = useState({ ...vehicle });
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        updateVehicle(vehicle.id, form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">✏️ Edit Vehicle — {vehicle.plate}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Make</label>
                                <input className="form-input" value={form.make} onChange={e => set("make", e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Model</label>
                                <input className="form-input" value={form.model} onChange={e => set("model", e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={e => set("status", e.target.value)}>
                                    {["Active", "In Service", "Inactive"].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Driver Assigned</label>
                                <input className="form-input" value={form.driver} onChange={e => set("driver", e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Mileage (km)</label>
                                <input className="form-input" type="number" value={form.mileage} onChange={e => set("mileage", parseInt(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Service Date</label>
                                <input className="form-input" type="date" value={form.lastService} onChange={e => set("lastService", e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
