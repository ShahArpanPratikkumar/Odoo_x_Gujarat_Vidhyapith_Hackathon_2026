const { Trip, Vehicle, Driver, FuelLog } = require('../models');
const { validate } = require('../utils/validators');
const { Op } = require('sequelize');


const isLicenseExpired = (expiry) => new Date(expiry) < new Date();


const getAll = async (req, res, next) => {
    try {
        const { status, vehicle_id, driver_id } = req.query;
        const where = {};
        if (status) where.status = status;
        if (vehicle_id) where.vehicle_id = vehicle_id;
        if (driver_id) where.driver_id = driver_id;

        const trips = await Trip.findAll({
            where,
            include: [
                { model: Vehicle, as: 'vehicle', attributes: ['id', 'name', 'license_plate', 'type', 'max_capacity_kg'] },
                { model: Driver, as: 'driver', attributes: ['id', 'name', 'license_number', 'license_expiry'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({ success: true, count: trips.length, data: trips });
    } catch (err) { next(err); }
};


const getOne = async (req, res, next) => {
    try {
        const trip = await Trip.findByPk(req.params.id, {
            include: [
                { model: Vehicle, as: 'vehicle' },
                { model: Driver, as: 'driver' },
                { model: FuelLog, as: 'fuelLogs' },
            ],
        });
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        res.json({ success: true, data: trip });
    } catch (err) { next(err); }
};


const create = async (req, res, next) => {
    try {
        const { error, value } = validate('trip', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const vehicle = await Vehicle.findByPk(value.vehicle_id);
        const driver = await Driver.findByPk(value.driver_id);

        
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        if (vehicle.status !== 'available') {
            return res.status(409).json({
                success: false,
                message: `Vehicle '${vehicle.name}' is not available. Current status: ${vehicle.status}.`,
            });
        }

        
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });
        if (driver.status !== 'available') {
            return res.status(409).json({
                success: false,
                message: `Driver '${driver.name}' is not available. Current status: ${driver.status}.`,
            });
        }

        
        if (isLicenseExpired(driver.license_expiry)) {
            await driver.update({ status: 'suspended' });
            return res.status(403).json({
                success: false,
                message: `Driver '${driver.name}' has an expired license (${driver.license_expiry}). Assignment blocked. Driver suspended.`,
            });
        }

        
        if (driver.license_category !== vehicle.type) {
            return res.status(403).json({
                success: false,
                message: `Driver license category '${driver.license_category}' does not match vehicle type '${vehicle.type}'.`,
            });
        }

        
        if (value.cargo_weight_kg > vehicle.max_capacity_kg) {
            return res.status(422).json({
                success: false,
                message: `Cargo weight (${value.cargo_weight_kg} kg) exceeds vehicle max capacity (${vehicle.max_capacity_kg} kg). Trip creation blocked.`,
                detail: {
                    cargo_weight_kg: value.cargo_weight_kg,
                    max_capacity_kg: vehicle.max_capacity_kg,
                    over_by_kg: value.cargo_weight_kg - vehicle.max_capacity_kg,
                },
            });
        }

        
        const trip = await Trip.create({
            ...value,
            status: 'dispatched',
            start_odometer: value.start_odometer || vehicle.odometer_km,
            created_by: req.user?.id,
        });

        
        await vehicle.update({ status: 'on_trip' });
        await driver.update({ status: 'on_trip', trips_total: driver.trips_total + 1 });

        res.status(201).json({ success: true, message: 'Trip dispatched successfully.', data: trip });
    } catch (err) { next(err); }
};


const dispatch = async (req, res, next) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        if (trip.status !== 'draft') {
            return res.status(409).json({ success: false, message: `Trip is already '${trip.status}'. Cannot dispatch.` });
        }
        await trip.update({ status: 'dispatched' });
        res.json({ success: true, message: 'Trip dispatched.', data: trip });
    } catch (err) { next(err); }
};


const complete = async (req, res, next) => {
    try {
        const { error, value } = validate('completeTrip', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const trip = await Trip.findByPk(req.params.id, {
            include: [
                { model: Vehicle, as: 'vehicle' },
                { model: Driver, as: 'driver' },
            ],
        });
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        if (!['dispatched'].includes(trip.status)) {
            return res.status(409).json({ success: false, message: `Cannot complete a trip with status '${trip.status}'.` });
        }

        
        await trip.update({
            status: 'completed',
            end_odometer: value.end_odometer,
            revenue: value.revenue,
            completed_at: new Date(),
        });

        
        if (trip.vehicle) {
            await trip.vehicle.update({ status: 'available', odometer_km: value.end_odometer });
        }
        if (trip.driver) {
            await trip.driver.update({
                status: 'available',
                trips_completed: trip.driver.trips_completed + 1,
            });
        }

        res.json({ success: true, message: 'Trip completed. Vehicle and driver are now available.', data: trip });
    } catch (err) { next(err); }
};


const cancel = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const trip = await Trip.findByPk(req.params.id, {
            include: [
                { model: Vehicle, as: 'vehicle' },
                { model: Driver, as: 'driver' },
            ],
        });
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        if (trip.status === 'completed' || trip.status === 'cancelled') {
            return res.status(409).json({ success: false, message: `Trip is already '${trip.status}'.` });
        }

        await trip.update({ status: 'cancelled', cancelled_reason: reason || '' });

        if (trip.vehicle && trip.vehicle.status === 'on_trip') {
            await trip.vehicle.update({ status: 'available' });
        }
        if (trip.driver && trip.driver.status === 'on_trip') {
            await trip.driver.update({ status: 'available' });
        }

        res.json({ success: true, message: 'Trip cancelled. Vehicle and driver released.', data: trip });
    } catch (err) { next(err); }
};


const remove = async (req, res, next) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
        if (trip.status !== 'draft') {
            return res.status(409).json({ success: false, message: 'Only draft trips can be deleted.' });
        }
        await trip.destroy();
        res.json({ success: true, message: 'Trip deleted.' });
    } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, dispatch, complete, cancel, remove };
