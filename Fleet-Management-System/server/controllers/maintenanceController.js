const { Maintenance, Vehicle } = require('../models');
const { validate } = require('../utils/validators');


const getAll = async (req, res, next) => {
    try {
        const { status, vehicle_id, priority } = req.query;
        const where = {};
        if (status) where.status = status;
        if (vehicle_id) where.vehicle_id = vehicle_id;
        if (priority) where.priority = priority;

        const logs = await Maintenance.findAll({
            where,
            include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'name', 'license_plate'] }],
            order: [['scheduled_date', 'ASC']],
        });
        res.json({ success: true, count: logs.length, data: logs });
    } catch (err) { next(err); }
};


const getOne = async (req, res, next) => {
    try {
        const log = await Maintenance.findByPk(req.params.id, {
            include: [{ model: Vehicle, as: 'vehicle' }],
        });
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });
        res.json({ success: true, data: log });
    } catch (err) { next(err); }
};


const create = async (req, res, next) => {
    try {
        const { error, value } = validate('maintenance', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const vehicle = await Vehicle.findByPk(value.vehicle_id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

        if (vehicle.status === 'on_trip') {
            return res.status(409).json({ success: false, message: `Vehicle '${vehicle.name}' is on an active trip. Cannot schedule maintenance.` });
        }
        if (vehicle.status === 'retired') {
            return res.status(409).json({ success: false, message: `Vehicle '${vehicle.name}' is retired.` });
        }

        
        const log = await Maintenance.create({ ...value, status: 'in_progress' });

        
        await vehicle.update({ status: 'in_shop' });

        res.status(201).json({
            success: true,
            message: `Maintenance logged. '${vehicle.name}' is now In Shop and hidden from dispatcher.`,
            data: log,
        });
    } catch (err) { next(err); }
};


const update = async (req, res, next) => {
    try {
        const log = await Maintenance.findByPk(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });
        await log.update(req.body);
        res.json({ success: true, message: 'Maintenance log updated.', data: log });
    } catch (err) { next(err); }
};


const complete = async (req, res, next) => {
    try {
        const log = await Maintenance.findByPk(req.params.id, {
            include: [{ model: Vehicle, as: 'vehicle' }],
        });
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });

        await log.update({ status: 'completed', completed_date: new Date().toISOString().split('T')[0] });

        
        if (log.vehicle && log.vehicle.status === 'in_shop') {
            await log.vehicle.update({ status: 'available' });
        }

        res.json({
            success: true,
            message: `Maintenance completed. '${log.vehicle?.name}' is now Available.`,
            data: log,
        });
    } catch (err) { next(err); }
};


const remove = async (req, res, next) => {
    try {
        const log = await Maintenance.findByPk(req.params.id, {
            include: [{ model: Vehicle, as: 'vehicle' }],
        });
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found.' });

        
        if (log.status === 'in_progress' && log.vehicle?.status === 'in_shop') {
            await log.vehicle.update({ status: 'available' });
        }
        await log.destroy();
        res.json({ success: true, message: 'Maintenance log deleted.' });
    } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, complete, remove };
