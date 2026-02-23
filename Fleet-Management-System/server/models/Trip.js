const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Trip = sequelize.define('Trip', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    cargo_weight_kg: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    cargo_description: { type: DataTypes.STRING },
    status: {
        type: DataTypes.ENUM('draft', 'dispatched', 'completed', 'cancelled'),
        defaultValue: 'draft',
    },
    scheduled_date: { type: DataTypes.DATEONLY, allowNull: false },
    start_odometer: { type: DataTypes.FLOAT },
    end_odometer: { type: DataTypes.FLOAT },
    distance_km: {
        type: DataTypes.VIRTUAL,
        get() {
            const start = this.getDataValue('start_odometer');
            const end = this.getDataValue('end_odometer');
            return (start != null && end != null) ? end - start : null;
        },
    },
    revenue: { type: DataTypes.FLOAT, defaultValue: 0 },
    completed_at: { type: DataTypes.DATE },
    cancelled_reason: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },

    
    vehicle_id: { type: DataTypes.UUID, allowNull: false },
    driver_id: { type: DataTypes.UUID, allowNull: false },
    created_by: { type: DataTypes.UUID },
}, { tableName: 'trips', timestamps: true });

module.exports = Trip;
