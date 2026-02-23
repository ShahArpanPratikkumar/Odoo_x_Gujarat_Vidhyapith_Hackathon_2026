export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatDistance = (km) =>
  `${km.toLocaleString("en-IN")} km`;

export const formatMileage = (km) =>
  km >= 1000 ? `${(km / 1000).toFixed(1)}K km` : `${km} km`;