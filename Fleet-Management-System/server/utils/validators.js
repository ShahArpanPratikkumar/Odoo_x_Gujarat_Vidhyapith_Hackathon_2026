const Joi = require('joi');

const schemas = {
    register: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('manager', 'dispatcher', 'safety_officer', 'analyst').default('dispatcher'),
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    vehicle: Joi.object({
        name: Joi.string().required(),
        license_plate: Joi.string().required(),
        type: Joi.string().valid('truck', 'van', 'bike').required(),
        max_capacity_kg: Joi.number().positive().required(),
        odometer_km: Joi.number().min(0).default(0),
        acquisition_cost: Joi.number().min(0).default(0),
        region: Joi.string().default('Gujarat'),
        make: Joi.string().allow('', 'null').optional(),
        model: Joi.string().allow('', 'null').optional(),
        year: Joi.number().integer().min(1990).max(2030).optional(),
        fuel_type: Joi.string().optional(),
        notes: Joi.string().allow('').optional(),
    }),

    driver: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().allow('').optional(),
        phone: Joi.string().allow('').optional(),
        license_number: Joi.string().required(),
        license_expiry: Joi.date().required(),
        license_category: Joi.string().valid('truck', 'van', 'bike').required(),
        joining_date: Joi.date().optional(),
        address: Joi.string().allow('').optional(),
        notes: Joi.string().allow('').optional(),
    }),

    trip: Joi.object({
        origin: Joi.string().required(),
        destination: Joi.string().required(),
        cargo_weight_kg: Joi.number().min(0).required(),
        cargo_description: Joi.string().allow('').optional(),
        vehicle_id: Joi.string().uuid().required(),
        driver_id: Joi.string().uuid().required(),
        scheduled_date: Joi.date().required(),
        start_odometer: Joi.number().min(0).optional(),
        revenue: Joi.number().min(0).default(0),
        notes: Joi.string().allow('').optional(),
    }),

    completeTrip: Joi.object({
        end_odometer: Joi.number().min(0).required(),
        revenue: Joi.number().min(0).default(0),
    }),

    maintenance: Joi.object({
        vehicle_id: Joi.string().uuid().required(),
        type: Joi.string().required(),
        technician: Joi.string().allow('').optional(),
        cost: Joi.number().min(0).default(0),
        priority: Joi.string().valid('normal', 'high', 'critical').default('normal'),
        scheduled_date: Joi.date().required(),
        notes: Joi.string().allow('').optional(),
    }),

    fuelLog: Joi.object({
        vehicle_id: Joi.string().uuid().required(),
        trip_id: Joi.string().uuid().allow(null).optional(),
        liters: Joi.number().positive().required(),
        cost_per_liter: Joi.number().positive().required(),
        odometer_at_fill: Joi.number().min(0).optional(),
        date: Joi.date().required(),
        notes: Joi.string().allow('').optional(),
    }),
};


const validate = (schemaName, body) => {
    const schema = schemas[schemaName];
    if (!schema) throw new Error(`Unknown schema: ${schemaName}`);
    return schema.validate(body, { abortEarly: false, allowUnknown: false });
};

module.exports = { validate };
