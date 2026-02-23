export const getFleetStats = (vehicles, drivers, trips, maintenance) => {
  const activeVehicles = vehicles.filter(v => v.status === "Active").length;
  const activeDrivers = drivers.filter(d => d.status === "Active" || d.status === "On Trip").length;
  const completedTrips = trips.filter(t => t.status === "Completed");
  const totalRevenue = completedTrips.reduce((s, t) => s + t.cost, 0);
  const totalMaintCost = maintenance.reduce((s, m) => s + m.cost, 0);
  const totalDistance = completedTrips.reduce((s, t) => s + t.distance, 0);
  const avgTripDistance = completedTrips.length ? totalDistance / completedTrips.length : 0;
  const netROI = totalRevenue - totalMaintCost;

  return {
    activeVehicles, activeDrivers,
    totalRevenue, totalMaintCost, netROI,
    completedTrips: completedTrips.length,
    totalDistance, avgTripDistance,
    utilizationRate: vehicles.length ? ((activeVehicles / vehicles.length) * 100).toFixed(0) : 0,
  };
};

export const getVehicleUtilization = (vehicle, trips) => {
  const vTrips = trips.filter(t => t.vehicle === vehicle.plate);
  return {
    totalTrips: vTrips.length,
    completedTrips: vTrips.filter(t => t.status === "Completed").length,
    revenue: vTrips.filter(t => t.status === "Completed").reduce((s, t) => s + t.cost, 0),
    distance: vTrips.reduce((s, t) => s + t.distance, 0),
  };
};