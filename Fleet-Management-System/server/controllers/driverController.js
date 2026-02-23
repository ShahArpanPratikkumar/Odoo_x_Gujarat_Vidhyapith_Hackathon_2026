const { Driver, Trip } = require('../models');
const { validate } = require('../utils/validators');


const getAll = async (req, res, next) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;

        
        const today = new Date().toISOString().split('T')[0];
        await Driver.update(
            { status: 'suspended' },
            { where: { license_expiry: { [require('sequelize').Op.lt]: today }, status: 'available' } }
        );

        const drivers = await Driver.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json({ success: true, count: drivers.length, data: drivers });
    } catch (err) { next(err); }
};


const getOne = async (req, res, next) => {
    try {
        const driver = await Driver.findByPk(req.params.id, {
            include: [{ model: Trip, as: 'trips', limit: 10, order: [['createdAt', 'DESC']] }],
        });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });

        const completionRate = driver.trips_total
            ? parseFloat(((driver.trips_completed / driver.trips_total) * 100).toFixed(1))
            : 0;

        res.json({ success: true, data: { ...driver.toJSON(), completion_rate: completionRate } });
    } catch (err) { next(err); }
};


const create = async (req, res, next) => {
    try {
        const { error, value } = validate('driver', req.body);
        if (error) return res.status(400).json({ success: false, message: error.details.map(d => d.message).join(', ') });

        
        const today = new Date().toISOString().split('T')[0];
        let status = 'available';
        if (value.license_expiry < today) status = 'suspended';

        const driver = await Driver.create({ ...value, status });
        res.status(201).json({ success: true, message: 'Driver registered.', data: driver });
    } catch (err) { next(err); }
};


const update = async (req, res, next) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });

        await driver.update(req.body);
        res.json({ success: true, message: 'Driver updated.', data: driver });
    } catch (err) { next(err); }
};


const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['available', 'off_duty', 'suspended'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
        }
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });

        if (driver.status === 'on_trip') {
            return res.status(409).json({ success: false, message: 'Cannot change status while driver is on an active trip.' });
        }
        await driver.update({ status });
        res.json({ success: true, message: `Driver status updated to '${status}'.`, data: driver });
    } catch (err) { next(err); }
};


const remove = async (req, res, next) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found.' });

        if (driver.status === 'on_trip') {
            return res.status(409).json({ success: false, message: 'Cannot remove a driver on an active trip.' });
        }
        await driver.destroy();
        res.json({ success: true, message: 'Driver removed.' });
    } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, updateStatus, remove };
