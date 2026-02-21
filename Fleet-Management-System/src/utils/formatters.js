export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatDistance = (km) =>
  `${km.toLocaleString("en-IN")} km`;

export const formatMileage = (km) =>
  km >= 1000 ? `${(km / 1000).toFixed(1)}K km` : `${km} km`;

export const formatDuration = (km, avgSpeedKmh = 60) => {
  const hours = km / avgSpeedKmh;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
};

export const formatFuelEfficiency = (km, litres) =>
  litres > 0 ? `${(km / litres).toFixed(1)} km/L` : "N/A";

export const formatShortDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });// Formatters Module
