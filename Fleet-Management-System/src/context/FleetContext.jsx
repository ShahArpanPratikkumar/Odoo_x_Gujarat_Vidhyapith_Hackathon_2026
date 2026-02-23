import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { vehicleService, driverService, tripService, maintenanceService } from "../services/fleetService";

const FleetContext = createContext();


const MOCK_VEHICLES = [
  { id: 1, plate: "GJ-01-AB-1234", make: "Tata", model: "Ace Gold", year: 2022, type: "Truck", status: "Active", fuel: "Diesel", mileage: 45200, lastService: "2026-01-10", driver: "Ramesh Patel" },
  { id: 2, plate: "GJ-05-CD-5678", make: "Mahindra", model: "Bolero", year: 2021, type: "SUV", status: "Active", fuel: "Diesel", mileage: 62100, lastService: "2025-12-05", driver: "Suresh Shah" },
  { id: 3, plate: "GJ-18-EF-9012", make: "Ashok Leyland", model: "Dost Strong", year: 2023, type: "Truck", status: "In Service", fuel: "Diesel", mileage: 18900, lastService: "2026-02-01", driver: "Mohit Joshi" },
  { id: 4, plate: "GJ-01-GH-3456", make: "Force Motors", model: "Traveller", year: 2020, type: "Van", status: "Active", fuel: "Diesel", mileage: 78400, lastService: "2025-11-20", driver: "Kiran Desai" },
  { id: 5, plate: "GJ-07-IJ-7890", make: "Maruti", model: "Eeco", year: 2022, type: "Van", status: "Inactive", fuel: "CNG", mileage: 31200, lastService: "2026-01-28", driver: "Unassigned" },
  { id: 6, plate: "GJ-01-KL-2345", make: "Tata", model: "407", year: 2019, type: "Truck", status: "Active", fuel: "Diesel", mileage: 95600, lastService: "2025-10-15", driver: "Arvind Kumar" },
  { id: 7, plate: "GJ-15-MN-6789", make: "Eicher", model: "Pro 2059", year: 2023, type: "Truck", status: "In Service", fuel: "Diesel", mileage: 12300, lastService: "2026-02-10", driver: "Nilesh Solanki" },
  { id: 8, plate: "GJ-10-OP-1122", make: "Toyota", model: "Innova", year: 2021, type: "SUV", status: "Active", fuel: "Petrol", mileage: 54700, lastService: "2026-01-05", driver: "Priya Mehta" },
];

const MOCK_DRIVERS = [
  { id: 1, name: "Ramesh Patel", license: "GJD20183047", phone: "9876543210", email: "ramesh@fleetpro.in", status: "Active", trips: 142, rating: 4.8, joined: "2020-06-15", vehicle: "GJ-01-AB-1234", color: "#3b82f6" },
  { id: 2, name: "Suresh Shah", license: "GJD20174219", phone: "9865432109", email: "suresh@fleetpro.in", status: "Active", trips: 218, rating: 4.6, joined: "2019-03-20", vehicle: "GJ-05-CD-5678", color: "#10b981" },
  { id: 3, name: "Mohit Joshi", license: "GJD20219834", phone: "9854321098", email: "mohit@fleetpro.in", status: "On Trip", trips: 87, rating: 4.9, joined: "2022-01-10", vehicle: "GJ-18-EF-9012", color: "#f59e0b" },
  { id: 4, name: "Kiran Desai", license: "GJD20165623", phone: "9843210987", email: "kiran@fleetpro.in", status: "Active", trips: 305, rating: 4.5, joined: "2018-08-01", vehicle: "GJ-01-GH-3456", color: "#8b5cf6" },
  { id: 5, name: "Arvind Kumar", license: "GJD20190127", phone: "9832109876", email: "arvind@fleetpro.in", status: "Off Duty", trips: 189, rating: 4.7, joined: "2021-05-12", vehicle: "GJ-01-KL-2345", color: "#ef4444" },
  { id: 6, name: "Nilesh Solanki", license: "GJD20228801", phone: "9821098765", email: "nilesh@fleetpro.in", status: "On Trip", trips: 34, rating: 4.4, joined: "2023-09-05", vehicle: "GJ-15-MN-6789", color: "#06b6d4" },
  { id: 7, name: "Priya Mehta", license: "GJD20201945", phone: "9810987654", email: "priya@fleetpro.in", status: "Active", trips: 93, rating: 4.9, joined: "2022-11-20", vehicle: "GJ-10-OP-1122", color: "#ec4899" },
];

const MOCK_TRIPS = [
  { id: 1, origin: "Ahmedabad", destination: "Surat", driver: "Ramesh Patel", vehicle: "GJ-01-AB-1234", date: "2026-02-18", distance: 272, status: "Completed", cost: 4200 },
  { id: 2, origin: "Surat", destination: "Mumbai", driver: "Suresh Shah", vehicle: "GJ-05-CD-5678", date: "2026-02-19", distance: 287, status: "Completed", cost: 4500 },
  { id: 3, origin: "Ahmedabad", destination: "Rajkot", driver: "Mohit Joshi", vehicle: "GJ-18-EF-9012", date: "2026-02-20", distance: 218, status: "In Progress", cost: 3200 },
  { id: 4, origin: "Vadodara", destination: "Ahmedabad", driver: "Kiran Desai", vehicle: "GJ-01-GH-3456", date: "2026-02-17", distance: 109, status: "Completed", cost: 1800 },
  { id: 5, origin: "Rajkot", destination: "Bhavnagar", driver: "Arvind Kumar", vehicle: "GJ-01-KL-2345", date: "2026-02-16", distance: 164, status: "Completed", cost: 2600 },
  { id: 6, origin: "Ahmedabad", destination: "Gandhinagar", driver: "Nilesh Solanki", vehicle: "GJ-15-MN-6789", date: "2026-02-21", distance: 30, status: "In Progress", cost: 650 },
  { id: 7, origin: "Surat", destination: "Valsad", driver: "Priya Mehta", vehicle: "GJ-10-OP-1122", date: "2026-02-15", distance: 87, status: "Completed", cost: 1400 },
  { id: 8, origin: "Ahmedabad", destination: "Mehsana", driver: "Ramesh Patel", vehicle: "GJ-01-AB-1234", date: "2026-02-14", distance: 76, status: "Completed", cost: 1200 },
  { id: 9, origin: "Vadodara", destination: "Surat", driver: "Suresh Shah", vehicle: "GJ-05-CD-5678", date: "2026-02-13", distance: 153, status: "Cancelled", cost: 0 },
  { id: 10, origin: "Ahmedabad", destination: "Jamnagar", driver: "Kiran Desai", vehicle: "GJ-01-GH-3456", date: "2026-02-21", distance: 313, status: "Scheduled", cost: 4800 },
  { id: 11, origin: "Surat", destination: "Navsari", driver: "Arvind Kumar", vehicle: "GJ-01-KL-2345", date: "2026-02-22", distance: 38, status: "Scheduled", cost: 750 },
  { id: 12, origin: "Rajkot", destination: "Ahmedabad", driver: "Nilesh Solanki", vehicle: "GJ-15-MN-6789", date: "2026-02-22", distance: 218, status: "Scheduled", cost: 3400 },
];

const MOCK_MAINTENANCE = [
  { id: 1, vehicle: "GJ-01-AB-1234", type: "Oil Change", date: "2026-03-05", status: "Scheduled", cost: 1200, priority: "Normal", technician: "Ravi Auto Works" },
  { id: 2, vehicle: "GJ-05-CD-5678", type: "Tyre Replacement", date: "2026-02-25", status: "Scheduled", cost: 8000, priority: "High", technician: "Bhavesh Tyres" },
  { id: 3, vehicle: "GJ-18-EF-9012", type: "Engine Overhaul", date: "2026-02-21", status: "In Progress", cost: 22000, priority: "Critical", technician: "AutoZone Service" },
  { id: 4, vehicle: "GJ-01-GH-3456", type: "Brake Service", date: "2026-01-30", status: "Completed", cost: 3500, priority: "High", technician: "Mehul Motors" },
  { id: 5, vehicle: "GJ-15-MN-6789", type: "AC Repair", date: "2026-02-20", status: "In Progress", cost: 4500, priority: "Normal", technician: "Cool Cars Ahmedabad" },
  { id: 6, vehicle: "GJ-01-KL-2345", type: "Tyre Rotation", date: "2026-02-10", status: "Completed", cost: 800, priority: "Normal", technician: "Ravi Auto Works" },
  { id: 7, vehicle: "GJ-10-OP-1122", type: "Filter Change", date: "2026-03-10", status: "Scheduled", cost: 900, priority: "Normal", technician: "QuickService Hub" },
  { id: 8, vehicle: "GJ-07-IJ-7890", type: "Full Inspection", date: "2026-02-18", status: "Overdue", cost: 1500, priority: "High", technician: "Unassigned" },
];


const normalizeVehicle = (v) => ({
  id: v.id,
  plate: v.license_plate || v.plate,
  name: v.name,
  make: v.make || v.name,
  model: v.model || "",
  year: v.year,
  type: v.type,
  status: v.status === "available" ? "Active" : v.status === "on_trip" ? "On Trip" : v.status === "in_shop" ? "In Service" : v.status,
  fuel: v.fuel_type || v.fuel || "Diesel",
  mileage: v.odometer_km || v.mileage || 0,
  lastService: v.updatedAt?.slice(0, 10) || v.lastService || "",
  driver: v.driver || "Unassigned",
  max_capacity_kg: v.max_capacity_kg,
  region: v.region,
});

const normalizeDriver = (d) => ({
  id: d.id,
  name: d.name,
  license: d.license_number || d.license,
  phone: d.phone || "",
  email: d.email || "",
  status: d.status === "available" ? "Active" : d.status === "on_trip" ? "On Trip" : d.status === "off_duty" ? "Off Duty" : d.status,
  trips: d.trips_completed || d.trips || 0,
  rating: d.safety_score ? parseFloat((d.safety_score / 20).toFixed(1)) : d.rating || 4.5,
  joined: d.joining_date || d.joined || "",
  vehicle: d.vehicle || "",
  color: d.color || "#4f46e5",
  license_expiry: d.license_expiry,
  license_category: d.license_category,
});

const normalizeTrip = (t) => ({
  id: t.id,
  origin: t.origin,
  destination: t.destination,
  driver: t.driver?.name || t.driver || "",
  vehicle: t.vehicle?.license_plate || t.vehicle || "",
  date: t.scheduled_date || t.date || "",
  distance: t.distance || 0,
  status: t.status === "dispatched" ? "In Progress" : t.status === "draft" ? "Scheduled" :
    t.status.charAt(0).toUpperCase() + t.status.slice(1),
  cost: t.revenue || t.cost || 0,
  cargo_weight_kg: t.cargo_weight_kg,
  vehicle_id: t.vehicle_id,
  driver_id: t.driver_id,
});

const normalizeMaintenance = (m) => ({
  id: m.id,
  vehicle: m.vehicle?.license_plate || m.vehicle || "",
  vehicle_id: m.vehicle_id,
  type: m.type,
  date: m.scheduled_date || m.date || "",
  status: m.status.charAt(0).toUpperCase() + m.status.slice(1).replace("_", " "),
  cost: m.cost || 0,
  priority: m.priority.charAt(0).toUpperCase() + m.priority.slice(1),
  technician: m.technician || "",
});

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [maintenance, setMaintenance] = useState(MOCK_MAINTENANCE);
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [v, d, t, m] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        tripService.getAll(),
        maintenanceService.getAll(),
      ]);
      setVehicles(v.map(normalizeVehicle));
      setDrivers(d.map(normalizeDriver));
      setTrips(t.map(normalizeTrip));
      setMaintenance(m.map(normalizeMaintenance));
      setBackendOnline(true);
    } catch {

      console.warn("⚠️ Backend offline — using mock data.");
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);


  const addVehicle = async (v) => {
    if (backendOnline) {
      try {
        const created = await vehicleService.create({
          name: v.name || `${v.make} ${v.model}`,
          license_plate: v.plate,
          type: v.type?.toLowerCase() || "van",
          max_capacity_kg: v.capacity || v.max_capacity_kg || 500,
          odometer_km: v.mileage || 0,
          acquisition_cost: v.acquisition_cost || 0,
          region: v.region || "Gujarat",
          make: v.make, model: v.model, year: v.year, fuel_type: v.fuel,
        });
        setVehicles(prev => [...prev, normalizeVehicle(created)]);
        return;
      } catch (e) {
        console.error("Add vehicle API error:", e.response?.data?.message || e.message);
        throw e;
      }
    }
    setVehicles(prev => [...prev, { ...v, id: Date.now() }]);
  };

  const updateVehicle = async (id, data) => {
    if (backendOnline) {
      try {
        const updated = await vehicleService.update(id, data);
        setVehicles(prev => prev.map(v => v.id === id ? normalizeVehicle(updated) : v));
        return;
      } catch (e) { console.error("Update vehicle error:", e.message); }
    }
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVehicle = async (id) => {
    if (backendOnline) {
      try { await vehicleService.remove(id); } catch (e) { console.error(e.message); }
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
  };


  const addDriver = async (d) => {
    if (backendOnline) {
      try {
        const created = await driverService.create({
          name: d.name,
          email: d.email,
          phone: d.phone,
          license_number: d.license,
          license_expiry: d.license_expiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          license_category: d.license_category || "van",
          joining_date: d.joined,
        });
        setDrivers(prev => [...prev, normalizeDriver(created)]);
        return;
      } catch (e) {
        console.error("Add driver error:", e.response?.data?.message || e.message);
        throw e;
      }
    }
    setDrivers(prev => [...prev, { ...d, id: Date.now(), trips: 0, rating: 5.0, color: "#3b82f6" }]);
  };

  const deleteDriver = async (id) => {
    if (backendOnline) {
      try { await driverService.remove(id); } catch (e) { console.error(e.message); }
    }
    setDrivers(prev => prev.filter(d => d.id !== id));
  };


  const addTrip = async (t) => {
    if (backendOnline) {
      try {
        const created = await tripService.create({
          origin: t.origin,
          destination: t.destination,
          vehicle_id: t.vehicle_id,
          driver_id: t.driver_id,
          cargo_weight_kg: t.cargo_weight_kg || 0,
          scheduled_date: t.date || new Date().toISOString().slice(0, 10),
          revenue: t.cost || 0,
        });
        setTrips(prev => [...prev, normalizeTrip(created)]);
        return;
      } catch (e) {
        const msg = e.response?.data?.message || e.message;
        console.error("Add trip error:", msg);
        throw new Error(msg);
      }
    }
    setTrips(prev => [...prev, { ...t, id: Date.now() }]);
  };

  const deleteTrip = async (id) => {
    if (backendOnline) {
      try { await tripService.remove(id); } catch (e) { console.error(e.message); }
    }
    setTrips(prev => prev.filter(t => t.id !== id));
  };


  const addMaintenance = async (m) => {
    if (backendOnline) {
      try {
        const created = await maintenanceService.create({
          vehicle_id: m.vehicle_id,
          type: m.type,
          technician: m.technician,
          cost: m.cost || 0,
          priority: m.priority?.toLowerCase() || "normal",
          scheduled_date: m.date || new Date().toISOString().slice(0, 10),
          notes: m.notes,
        });
        setMaintenance(prev => [...prev, normalizeMaintenance(created)]);

        if (created.vehicle_id) {
          setVehicles(prev => prev.map(v =>
            v.id === created.vehicle_id ? { ...v, status: "In Service" } : v
          ));
        }
        return;
      } catch (e) {
        const msg = e.response?.data?.message || e.message;
        console.error("Add maintenance error:", msg);
        throw new Error(msg);
      }
    }
    setMaintenance(prev => [...prev, { ...m, id: Date.now() }]);
  };

  const deleteMaintenance = async (id) => {
    if (backendOnline) {
      try { await maintenanceService.remove(id); } catch (e) { console.error(e.message); }
    }
    setMaintenance(prev => prev.filter(m => m.id !== id));
  };

  return (
    <FleetContext.Provider value={{

      vehicles, setVehicles,
      drivers, setDrivers,
      trips, setTrips,
      maintenance, setMaintenance,

      backendOnline, loading,

      refetch: fetchAll,

      addVehicle, updateVehicle, deleteVehicle,

      addDriver, deleteDriver,

      addTrip, deleteTrip,

      addMaintenance, deleteMaintenance,

      searchQuery, setSearchQuery,
    }}>
      {children}
    </FleetContext.Provider>
  );
}

export const useFleet = () => useContext(FleetContext);