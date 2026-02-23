const { Vehicle, Trip, Maintenance, FuelLog } = require('../models');
const { validate } = require('../utils/validators');
const { Op } = require('sequelize');


const getAll = async (req, res, next) => {
    try {
        const { status, type, region } = req.query;
        const where = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (region) where.region = region;

        const vehicles = await Vehicle.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json({ success: true, count: vehicles.length, data: vehicles });
    } catch (err) { next(err); }
};


const getOne = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id, {
            include: [
                { model: Trip, as: 'trips', limit: 10, order: [['createdAt', 'DESC']] },
                { model: Maintenance, as: 'maintenanceLogs', limit: 10, order: [['scheduled_date', 'DESC']] },
            ],
        });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        res.json({ success: true, data: vehicle });
    } catch (err) { next(err); }
};


const create = async (req, res, next) => {
    try {
        const { error, value } = validate('vehicle', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const vehicle = await Vehicle.create(value);
        res.status(201).json({ success: true, message: 'Vehicle added to fleet.', data: vehicle });
    } catch (err) { next(err); }
};


const update = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

        await vehicle.update(req.body);
        res.json({ success: true, message: 'Vehicle updated.', data: vehicle });
    } catch (err) { next(err); }
};


const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['available', 'retired'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
        }
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

        if (vehicle.status === 'on_trip') {
            return res.status(409).json({ success: false, message: 'Cannot change status while vehicle is on an active trip.' });
        }
        await vehicle.update({ status });
        res.json({ success: true, message: `Vehicle status updated to '${status}'.`, data: vehicle });
    } catch (err) { next(err); }
};


const remove = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
        if (vehicle.status === 'on_trip') {
            return res.status(409).json({ success: false, message: 'Cannot remove a vehicle that is on an active trip.' });
        }
        await vehicle.update({ status: 'retired' });
        res.json({ success: true, message: 'Vehicle retired from fleet.' });
    } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, updateStatus, remove };
