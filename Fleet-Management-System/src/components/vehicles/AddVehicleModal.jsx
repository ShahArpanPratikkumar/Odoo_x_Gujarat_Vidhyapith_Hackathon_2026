import { useState } from "react";
import { useFleet } from "../../context/FleetContext";

export default function AddVehicleModal({ onClose }) {
    const { addVehicle } = useFleet();
    const [form, setForm] = useState({
        plate: "", make: "", model: "", year: new Date().getFullYear(),
        type: "Truck", fuel: "Diesel", status: "Active", mileage: 0,
        lastService: "", driver: "Unassigned",
    });

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.plate || !form.make || !form.model) return;
        addVehicle(form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">🚛 Add New Vehicle</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Plate Number *</label>
                                <input className="form-input" placeholder="GJ-01-AB-1234" value={form.plate} onChange={e => set("plate", e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                                    {["Truck", "Van", "SUV", "Car", "Bus"].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Make *</label>
                                <input className="form-input" placeholder="e.g. Tata" value={form.make} onChange={e => set("make", e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Model *</label>
                                <input className="form-input" placeholder="e.g. Ace Gold" value={form.model} onChange={e => set("model", e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input className="form-input" type="number" min="2000" max="2030" value={form.year} onChange={e => set("year", parseInt(e.target.value))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fuel Type</label>
                                <select className="form-select" value={form.fuel} onChange={e => set("fuel", e.target.value)}>
                                    {["Diesel", "Petrol", "CNG", "Electric"].map(f => <option key={f}>{f}</option>)}
                                </select>
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
                                <label className="form-label">Current Mileage (km)</label>
                                <input className="form-input" type="number" min="0" value={form.mileage} onChange={e => set("mileage", parseInt(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Vehicle</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
