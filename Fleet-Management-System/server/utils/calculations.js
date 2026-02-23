const { FuelLog, Maintenance, Trip, Vehicle } = require('../models');
const { Op, fn, col, literal } = require('sequelize');


const getFuelEfficiency = async (vehicleId) => {
    const logs = await FuelLog.findAll({
        where: { vehicle_id: vehicleId },
        attributes: ['liters', 'odometer_at_fill'],
        order: [['date', 'ASC']],
    });
    if (logs.length < 2) return null;
    const totalLiters = logs.reduce((s, l) => s + (l.liters || 0), 0);
    const firstOdo = logs[0].odometer_at_fill || 0;
    const lastOdo = logs[logs.length - 1].odometer_at_fill || 0;
    const totalKm = lastOdo - firstOdo;
    if (totalLiters === 0) return null;
    return parseFloat((totalKm / totalLiters).toFixed(2));
};


const getTotalCost = async (vehicleId) => {
    const fuelResult = await FuelLog.findOne({
        where: { vehicle_id: vehicleId },
        attributes: [[fn('SUM', col('total_cost_stored')), 'total']],
        raw: true,
    });
    const maintResult = await Maintenance.findOne({
        where: { vehicle_id: vehicleId },
        attributes: [[fn('SUM', col('cost')), 'total']],
        raw: true,
    });
    const fuelCost = parseFloat(fuelResult?.total || 0);
    const maintCost = parseFloat(maintResult?.total || 0);
    return { fuelCost, maintCost, totalCost: fuelCost + maintCost };
};


const getTotalRevenue = async (vehicleId) => {
    const result = await Trip.findOne({
        where: { vehicle_id: vehicleId, status: 'completed' },
        attributes: [[fn('SUM', col('revenue')), 'total']],
        raw: true,
    });
    return parseFloat(result?.total || 0);
};


const getVehicleROI = async (vehicle) => {
    const revenue = await getTotalRevenue(vehicle.id);
    const { totalCost } = await getTotalCost(vehicle.id);
    const acquisitionCost = vehicle.acquisition_cost || 1; 
    const roi = ((revenue - totalCost) / acquisitionCost) * 100;
    return { revenue, totalCost, roi: parseFloat(roi.toFixed(2)) };
};


const getCompletionRate = (driver) => {
    if (!driver.trips_total) return 0;
    return parseFloat(((driver.trips_completed / driver.trips_total) * 100).toFixed(1));
};


const getCostPerKm = async (vehicle) => {
    const { totalCost } = await getTotalCost(vehicle.id);
    const km = vehicle.odometer_km || 1;
    return parseFloat((totalCost / km).toFixed(2));
};

module.exports = {
    getFuelEfficiency,
    getTotalCost,
    getTotalRevenue,
    getVehicleROI,
    getCompletionRate,
    getCostPerKm,
};
