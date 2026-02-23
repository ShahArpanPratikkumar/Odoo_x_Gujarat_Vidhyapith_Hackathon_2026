const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FuelLog = sequelize.define('FuelLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    liters: { type: DataTypes.FLOAT, allowNull: false },
    cost_per_liter: { type: DataTypes.FLOAT, allowNull: false },
    total_cost: {
        type: DataTypes.VIRTUAL,
        get() {
            return (this.getDataValue('liters') || 0) * (this.getDataValue('cost_per_liter') || 0);
        },
    },
    total_cost_stored: { type: DataTypes.FLOAT }, 
    odometer_at_fill: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    notes: { type: DataTypes.STRING },

    vehicle_id: { type: DataTypes.UUID, allowNull: false },
    trip_id: { type: DataTypes.UUID },  
}, { tableName: 'fuel_logs', timestamps: true });

module.exports = FuelLog;
