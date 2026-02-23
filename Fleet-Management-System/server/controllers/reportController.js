const { Vehicle, Driver, Trip, Maintenance, FuelLog } = require('../models');
const { fn, col, Op, literal } = require('sequelize');
const { getFuelEfficiency, getTotalCost, getTotalRevenue, getVehicleROI, getCostPerKm, getCompletionRate } = require('../utils/calculations');


const getDashboard = async (req, res, next) => {
    try {
        const [
            totalVehicles,
            activeFleet,
            inShop,
            retiredVehicles,
            totalDrivers,
            activeDrivers,
            suspendedDrivers,
            totalTrips,
            completedTrips,
            inProgressTrips,
            scheduledTrips,
            overdueMaintenances,
            criticalMaintenances,
        ] = await Promise.all([
            Vehicle.count(),
            Vehicle.count({ where: { status: 'on_trip' } }),
            Vehicle.count({ where: { status: 'in_shop' } }),
            Vehicle.count({ where: { status: 'retired' } }),
            Driver.count(),
            Driver.count({ where: { status: 'available' } }),
            Driver.count({ where: { status: 'suspended' } }),
            Trip.count(),
            Trip.count({ where: { status: 'completed' } }),
            Trip.count({ where: { status: 'dispatched' } }),
            Trip.count({ where: { status: 'draft' } }),
            Maintenance.count({ where: { status: 'overdue' } }),
            Maintenance.count({ where: { priority: 'critical' } }),
        ]);

        
        const revResult = await Trip.findOne({
            where: { status: 'completed' },
            attributes: [[fn('SUM', col('revenue')), 'total']],
            raw: true,
        });
        const totalRevenue = parseFloat(revResult?.total || 0);

        
        const utilizationRate = totalVehicles
            ? parseFloat(((activeFleet + inShop) / totalVehicles * 100).toFixed(1))
            : 0;

        
        const inThirtyDays = new Date();
        inThirtyDays.setDate(inThirtyDays.getDate() + 30);
        const expiryWarnings = await Driver.count({
            where: {
                license_expiry: { [Op.between]: [new Date(), inThirtyDays] },
                status: { [Op.ne]: 'suspended' },
            },
        });

        res.json({
            success: true,
            data: {
                vehicles: { total: totalVehicles, onTrip: activeFleet, inShop, available: totalVehicles - activeFleet - inShop - retiredVehicles, retired: retiredVehicles },
                drivers: { total: totalDrivers, available: activeDrivers, suspended: suspendedDrivers, onTrip: totalDrivers - activeDrivers - suspendedDrivers },
                trips: { total: totalTrips, completed: completedTrips, inProgress: inProgressTrips, draft: scheduledTrips },
                finance: { totalRevenue },
                alerts: { overdueMaintenances, criticalMaintenances, licenseExpirySoon: expiryWarnings },
                utilizationRate,
            },
        });
    } catch (err) { next(err); }
};


const getVehicleROIReport = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

        const [roi, fuelEff, costPerKm, trips] = await Promise.all([
            getVehicleROI(vehicle),
            getFuelEfficiency(vehicle.id),
            getCostPerKm(vehicle),
            Trip.count({ where: { vehicle_id: vehicle.id, status: 'completed' } }),
        ]);

        res.json({
            success: true,
            data: {
                vehicle: { id: vehicle.id, name: vehicle.name, plate: vehicle.license_plate, acquisition_cost: vehicle.acquisition_cost },
                ...roi,
                fuelEfficiency: fuelEff,
                costPerKm,
                completedTrips: trips,
            },
        });
    } catch (err) { next(err); }
};


const getFuelEfficiencyReport = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.findAll({ where: { status: { [Op.ne]: 'retired' } } });
        const results = await Promise.all(
            vehicles.map(async (v) => ({
                id: v.id,
                name: v.name,
                plate: v.license_plate,
                type: v.type,
                fuelEfficiency: await getFuelEfficiency(v.id),
            }))
        );
        res.json({ success: true, data: results.filter(r => r.fuelEfficiency !== null) });
    } catch (err) { next(err); }
};


const getCostReport = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.findAll();
        const results = await Promise.all(
            vehicles.map(async (v) => {
                const costs = await getTotalCost(v.id);
                const revenue = await getTotalRevenue(v.id);
                const roi = v.acquisition_cost ? parseFloat(((revenue - costs.totalCost) / v.acquisition_cost * 100).toFixed(2)) : 0;
                return {
                    id: v.id, name: v.name, plate: v.license_plate, type: v.type,
                    ...costs,
                    revenue,
                    roi,
                    odometer: v.odometer_km,
                    costPerKm: v.odometer_km ? parseFloat((costs.totalCost / v.odometer_km).toFixed(2)) : 0,
                };
            })
        );
        res.json({ success: true, data: results });
    } catch (err) { next(err); }
};


const getDriverPerformance = async (req, res, next) => {
    try {
        const drivers = await Driver.findAll();
        const results = drivers.map(d => ({
            id: d.id, name: d.name, status: d.status,
            license_expiry: d.license_expiry,
            safety_score: d.safety_score,
            trips_completed: d.trips_completed,
            trips_total: d.trips_total,
            completion_rate: getCompletionRate(d),
        }));
        res.json({ success: true, data: results });
    } catch (err) { next(err); }
};


const exportCSV = async (req, res, next) => {
    try {
        const { Parser } = require('json2csv');
        const { type = 'trips' } = req.query;

        let data = [];
        let fields = [];

        if (type === 'trips') {
            const trips = await Trip.findAll({
                include: [
                    { model: Vehicle, as: 'vehicle', attributes: ['name', 'license_plate'] },
                    { model: Driver, as: 'driver', attributes: ['name'] },
                ],
                raw: true, nest: true,
            });
            fields = ['id', 'origin', 'destination', 'status', 'cargo_weight_kg', 'revenue', 'scheduled_date', 'completed_at', 'vehicle.name', 'vehicle.license_plate', 'driver.name'];
            data = trips;
        } else if (type === 'vehicles') {
            data = await Vehicle.findAll({ raw: true });
            fields = ['id', 'name', 'license_plate', 'type', 'status', 'max_capacity_kg', 'odometer_km', 'acquisition_cost', 'region'];
        } else if (type === 'drivers') {
            data = await Driver.findAll({ raw: true });
            fields = ['id', 'name', 'email', 'license_number', 'license_expiry', 'license_category', 'status', 'safety_score', 'trips_completed', 'trips_total'];
        } else if (type === 'maintenance') {
            data = await Maintenance.findAll({
                include: [{ model: Vehicle, as: 'vehicle', attributes: ['name', 'license_plate'] }],
                raw: true, nest: true,
            });
            fields = ['id', 'type', 'status', 'priority', 'cost', 'scheduled_date', 'completed_date', 'technician', 'vehicle.name', 'vehicle.license_plate'];
        }

        const parser = new Parser({ fields });
        const csv = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename=${type}_report_${Date.now()}.csv`);
        res.send(csv);
    } catch (err) { next(err); }
};

module.exports = { getDashboard, getVehicleROIReport, getFuelEfficiencyReport, getCostReport, getDriverPerformance, exportCSV };
