const { FuelLog, Vehicle, Trip } = require('../models');
const { validate } = require('../utils/validators');


const getAll = async (req, res, next) => {
    try {
        const { vehicle_id } = req.query;
        const where = {};
        if (vehicle_id) where.vehicle_id = vehicle_id;

        const logs = await FuelLog.findAll({
            where,
            include: [
                { model: Vehicle, as: 'vehicle', attributes: ['id', 'name', 'license_plate'] },
                { model: Trip, as: 'trip', attributes: ['id', 'origin', 'destination'] },
            ],
            order: [['date', 'DESC']],
        });
        res.json({ success: true, count: logs.length, data: logs });
    } catch (err) { next(err); }
};


const getByVehicle = async (req, res, next) => {
    try {
        const logs = await FuelLog.findAll({
            where: { vehicle_id: req.params.vehicleId },
            order: [['date', 'DESC']],
        });
        const totalLiters = logs.reduce((s, l) => s + (l.liters || 0), 0);
        const totalCost = logs.reduce((s, l) => s + (l.total_cost_stored || 0), 0);
        res.json({
            success: true,
            count: logs.length,
            stats: { totalLiters, totalCost: parseFloat(totalCost.toFixed(2)) },
            data: logs,
        });
    } catch (err) { next(err); }
};


const create = async (req, res, next) => {
    try {
        const { error, value } = validate('fuelLog', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        const vehicle = await Vehicle.findByPk(value.vehicle_id);
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

        const total_cost_stored = parseFloat((value.liters * value.cost_per_liter).toFixed(2));
        const log = await FuelLog.create({ ...value, total_cost_stored });

        res.status(201).json({ success: true, message: 'Fuel log recorded.', data: { ...log.toJSON(), total_cost: total_cost_stored } });
    } catch (err) { next(err); }
};


const remove = async (req, res, next) => {
    try {
        const log = await FuelLog.findByPk(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found.' });
        await log.destroy();
        res.json({ success: true, message: 'Fuel log deleted.' });
    } catch (err) { next(err); }
};

module.exports = { getAll, getByVehicle, create, remove };
